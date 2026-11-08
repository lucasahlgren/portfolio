import { ArrowUpRight, Mail } from "lucide-react";
import type { Metadata } from "next";

import { PortableText } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { PageHeader } from "@/components/section-heading";
import { SocialIcon, socialLabels } from "@/components/social-icon";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getSettings } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "About",
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <>
      <PageHeader
        eyebrow="About"
        title={
          <>
            Hello, I&apos;m{" "}
            <span className="font-serif font-normal italic">{firstName(settings?.name)}</span>
          </>
        }
      />

      <section className="container-page grid gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16 lg:gap-24">
        <div className="overflow-hidden rounded-2xl bg-muted md:sticky md:top-24 md:self-start">
          <AspectRatio ratio={4 / 5}>
            <SanityImage
              image={settings?.portrait}
              fill
              priority
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover object-top"
            />
          </AspectRatio>
        </div>

        <div>
          <PortableText value={settings?.bio} />

          <div className="mt-10 flex flex-wrap gap-3">
            {settings?.email && (
              <Button asChild size="lg" className="h-11 rounded-full px-6">
                <a href={`mailto:${settings.email}`}>
                  <Mail className="size-4" /> {settings.email}
                </a>
              </Button>
            )}
            {settings?.socials?.map((social) => (
              <Button
                key={social._key}
                asChild
                size="lg"
                variant="outline"
                className="h-11 rounded-full px-5"
              >
                <a href={social.url} target="_blank" rel="noreferrer">
                  <SocialIcon platform={social.platform} className="size-4" />
                  {socialLabels[social.platform]}
                  <ArrowUpRight className="size-3.5 text-muted-foreground" />
                </a>
              </Button>
            ))}
          </div>

          {settings?.skills && settings.skills.length > 0 && (
            <div className="mt-16">
              <Separator className="mb-8" />
              <p className="eyebrow mb-5">Tools &amp; technologies</p>
              <ul className="flex flex-wrap gap-2">
                {settings.skills.map((skill) => (
                  <li key={skill}>
                    <Badge
                      variant="outline"
                      className="label h-8 rounded-full px-3.5 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
                    >
                      {skill}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function firstName(name: string | null | undefined) {
  return name?.split(" ")[0] ?? "Lucas";
}
