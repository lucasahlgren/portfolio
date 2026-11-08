import {
  createContentClient,
  createImageBuilder,
  DEFAULT_API_VERSION,
  hasAsset,
  type SanityImage,
} from "@portfolio/content";

const projectId = process.env.EXPO_PUBLIC_SANITY_PROJECT_ID ?? "";
const dataset = process.env.EXPO_PUBLIC_SANITY_DATASET ?? "production";

export const isSanityConfigured = Boolean(projectId);

export const client = createContentClient({
  projectId,
  dataset,
  apiVersion: DEFAULT_API_VERSION,
  useCdn: true,
});

const builder = isSanityConfigured ? createImageBuilder({ projectId, dataset }) : null;

export function imageUrl(
  image: SanityImage | null | undefined,
  width: number,
  format?: "png",
): string | null {
  if (!builder || !hasAsset(image)) return null;
  const b = builder(image).width(Math.round(width)).fit("max");
  return (format ? b.format(format) : b.auto("format")).url();
}

export const siteUrl = process.env.EXPO_PUBLIC_SITE_URL ?? "https://lucasahlgren.se";
