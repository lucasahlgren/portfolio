import type { SanityImage as SanityImageType } from "@portfolio/content/types";
import { Image } from "next-sanity/image";
import { cn } from "@/lib/utils";

import { imageUrl } from "@/lib/sanity/image";

type Props = {
  image: SanityImageType | null | undefined;
  alt?: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  blur?: boolean;
  onLoad?: () => void;
};

export function SanityImage({
  image,
  alt,
  sizes,
  className,
  priority,
  fill,
  blur = true,
  onLoad,
}: Props) {
  const src = imageUrl(image);
  if (!image || !src) {
    return (
      <div aria-hidden="true" className={cn("bg-muted", fill && "absolute inset-0", className)} />
    );
  }

  const dims = image.dimensions;
  const altText = alt ?? image.alt ?? "";
  const shared = {
    src,
    sizes,
    className,
    priority,
    placeholder: blur && image.lqip ? ("blur" as const) : ("empty" as const),
    blurDataURL: blur ? (image.lqip ?? undefined) : undefined,
    onLoad,
  };

  return fill || !dims ? (
    <Image {...shared} alt={altText} fill />
  ) : (
    <Image {...shared} alt={altText} width={dims.width} height={dims.height} />
  );
}
