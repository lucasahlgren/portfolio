import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/sanity/env";
import { getProjectSlugs } from "@/lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getProjectSlugs();
  const pages = ["", "/projects", "/experience", "/photography", "/about"];

  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}` })),
    ...slugs.map((slug) => ({ url: `${siteUrl}/projects/${slug}` })),
  ];
}
