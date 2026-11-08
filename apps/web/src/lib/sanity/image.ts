import { createImageBuilder, hasAsset } from "@portfolio/content/image";
import type { SanityImage } from "@portfolio/content/types";

import { dataset, isSanityConfigured, projectId } from "./env";

const builder = isSanityConfigured ? createImageBuilder({ projectId, dataset }) : null;

export function imageUrl(image: SanityImage | null | undefined, width?: number): string | null {
  if (!builder || !hasAsset(image)) return null;
  let b = builder(image).auto("format").fit("max");
  if (width) b = b.width(width);
  return b.url();
}
