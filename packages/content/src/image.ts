import { createImageUrlBuilder } from "@sanity/image-url";

import type { SanityImage } from "./types";

export function createImageBuilder(config: { projectId: string; dataset: string }) {
  const builder = createImageUrlBuilder(config);
  return (source: SanityImage) => builder.image(source);
}

export function hasAsset(image: SanityImage | null | undefined): image is SanityImage {
  return Boolean(image?.asset?._ref);
}
