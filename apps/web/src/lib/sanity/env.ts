import { DEFAULT_API_VERSION } from "@portfolio/content/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? DEFAULT_API_VERSION;

export const isSanityConfigured = Boolean(projectId);

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lucasahlgren.se").replace(
  /\/$/,
  "",
);
