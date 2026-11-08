import { createReadStream, existsSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

import { createClient } from "@sanity/client";

import { education, photos, projects, settings } from "./data.ts";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.\n" +
      "Add them to apps/web/.env.local (see apps/web/.env.example).",
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: "2026-11-01", useCdn: false });
const assetsDir = join(dirname(fileURLToPath(import.meta.url)), "assets");
const key = () => randomUUID().slice(0, 12);

const uploaded = new Map<string, string>();
async function image(file: string, alt = "") {
  const path = join(assetsDir, file);
  if (!existsSync(path)) throw new Error(`Missing seed asset: ${file}`);
  let assetId = uploaded.get(file);
  if (!assetId) {
    const asset = await client.assets.upload("image", createReadStream(path), {
      filename: basename(path),
    });
    assetId = asset._id;
    uploaded.set(file, assetId);
    console.log(`  ↑ ${file}`);
  }
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: assetId }, alt };
}

const blocks = (paragraphs: string[]) =>
  paragraphs.map((text) => ({
    _type: "block",
    _key: key(),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: key(), text, marks: [] }],
  }));

async function main() {
  console.log(`Seeding ${projectId}/${dataset}…`);
  const tx = client.transaction();

  console.log("Settings");
  tx.createOrReplace({
    _id: "settings",
    _type: "settings",
    name: settings.name,
    role: settings.role,
    headline: settings.headline,
    intro: settings.intro,
    location: settings.location,
    email: settings.email,
    availableForWork: settings.availableForWork,
    portrait: await image(settings.portrait.file, settings.portrait.alt),
    bio: blocks(settings.bio),
    skills: settings.skills,
    socials: settings.socials.map((s) => ({ _key: key(), ...s })),
  });

  console.log("Projects");
  for (const [index, p] of projects.entries()) {
    tx.createOrReplace({
      _id: `project-${p.slug}`,
      _type: "project",
      title: p.title,
      slug: { _type: "slug", current: p.slug },
      subtitle: p.subtitle,
      excerpt: p.excerpt,
      kind: p.kind ?? "school",
      category: p.category,
      year: p.year,
      featured: p.featured ?? false,
      sortOrder: index + 1,
      accentColor: p.accentColor,
      coverImage: await image(p.cover, p.title),
      gallery: p.gallery
        ? await Promise.all(
            p.gallery.map(async (file) => ({ _key: key(), ...(await image(file, p.title)) })),
          )
        : undefined,
      videoUrl: p.videoUrl,
      body: blocks(p.paragraphs),
      team: p.team,
      tools: p.tools,
      links: p.links.map((l) => ({ _key: key(), ...l })),
    });
  }

  console.log("Education");
  for (const e of education) {
    const { id, logo, ...rest } = e;
    tx.createOrReplace({
      _id: `education-${id}`,
      _type: "education",
      ...rest,
      logo: await image(logo, `${e.school} logo`),
    });
  }

  console.log("Photo categories");
  const photoCategories = [...new Set(photos.map((ph) => ph.category))];
  photoCategories.forEach((slug, i) => {
    tx.createIfNotExists({
      _id: `photoCategory-${slug}`,
      _type: "photoCategory",
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      slug: { _type: "slug", current: slug },
      sortOrder: (i + 1) * 10,
    });
  });

  console.log("Photos");
  for (const ph of photos) {
    tx.createOrReplace({
      _id: `photo-${ph.file.replace(/\.\w+$/, "").replace(/[^a-z0-9-]/gi, "-")}`,
      _type: "photo",
      title: ph.title,
      takenAt: ph.date,
      category: { _type: "reference", _ref: `photoCategory-${ph.category}` },
      image: await image(ph.file, ph.title),
    });
  }

  await tx.commit();
  console.log("✓ Done. Add your jobs in the Studio at /studio → Jobs.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
