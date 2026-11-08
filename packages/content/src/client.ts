import { createClient, type SanityClient } from "@sanity/client";

export const DEFAULT_API_VERSION = "2026-11-01";

export type ContentConfig = {
  projectId: string | undefined;
  dataset: string | undefined;
  apiVersion?: string;
  useCdn?: boolean;
  token?: string;
};

export function isConfigured(config: Pick<ContentConfig, "projectId" | "dataset">): boolean {
  return Boolean(config.projectId && config.dataset);
}

export function createContentClient(config: ContentConfig): SanityClient | null {
  if (!isConfigured(config)) return null;
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion ?? DEFAULT_API_VERSION,
    useCdn: config.useCdn ?? true,
    token: config.token,
    perspective: "published",
  });
}
