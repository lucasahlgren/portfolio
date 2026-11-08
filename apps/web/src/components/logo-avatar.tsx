import type { SanityImage as SanityImageType } from "@portfolio/content/types";

import { SanityImage } from "@/components/sanity-image";
import { imageUrl } from "@/lib/sanity/image";

export function LogoAvatar({ logo, name }: { logo: SanityImageType | null; name: string }) {
  const hasLogo = Boolean(imageUrl(logo));

  return (
    <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white text-xs font-medium text-neutral-900 ring-1 ring-foreground/10">
      {hasLogo ? (
        <SanityImage
          image={logo}
          alt={logo?.alt || name}
          fill
          sizes="48px"
          className="object-contain p-1.5"
        />
      ) : (
        name
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      )}
    </span>
  );
}
