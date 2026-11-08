import type { PortableTextBlock, SanityImage as SanityImageType } from "@portfolio/content/types";
import { PortableText as BasePortableText, type PortableTextComponents } from "@portabletext/react";

import { SanityImage } from "@/components/sanity-image";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 text-2xl font-medium tracking-tight text-foreground">{children}</h2>
    ),
    h3: ({ children }) => <h3 className="mt-8 text-xl font-medium text-foreground">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-brand pl-5 font-serif text-2xl text-foreground italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="text-foreground underline decoration-brand underline-offset-4 hover:decoration-2"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => <strong className="font-medium text-foreground">{children}</strong>,
  },
  types: {
    image: ({ value }: { value: SanityImageType & { caption?: string } }) => (
      <figure className="my-10">
        <SanityImage
          image={value}
          sizes="(min-width: 768px) 720px, 100vw"
          className="h-auto w-full rounded-2xl"
        />
        {value.caption && (
          <figcaption className="mt-3 text-sm text-muted-foreground">{value.caption}</figcaption>
        )}
      </figure>
    ),
  },
};

export function PortableText({ value }: { value: PortableTextBlock[] | null | undefined }) {
  if (!value?.length) return null;
  return (
    <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
      <BasePortableText value={value} components={components} />
    </div>
  );
}
