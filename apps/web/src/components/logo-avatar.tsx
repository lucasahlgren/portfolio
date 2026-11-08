import type { SanityImage } from "@portfolio/content/types";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageUrl } from "@/lib/sanity/image";

export function LogoAvatar({ logo, name }: { logo: SanityImage | null; name: string }) {
  const src = imageUrl(logo, 120);
  return (
    <Avatar className="size-10 rounded-lg bg-white after:rounded-lg">
      {src && <AvatarImage src={src} alt={logo?.alt || name} className="object-contain p-1" />}
      <AvatarFallback className="rounded-lg text-xs font-medium">
        {name
          .split(/\s+/)
          .map((w) => w[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
}
