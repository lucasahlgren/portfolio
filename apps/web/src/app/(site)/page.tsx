import { ArrowDownRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import heroImage from "@/assets/hero.png";

import { EmptyState } from "@/components/empty-state";
import { JobList } from "@/components/job-list";
import { Marquee } from "@/components/marquee";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { SanityImage } from "@/components/sanity-image";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { WheelCarousel } from "@/components/wheel-carousel";
import { getHome } from "@/lib/sanity/queries";

export default async function HomePage() {
  const { settings, projects, jobs, photos } = await getHome();
  const [first, ...rest] = projects;

  return (
    <>
      <section className="container-page overflow-x-clip pt-6 pb-20 sm:pt-10 sm:pb-28 lg:pt-28">
        <div className="relative">
          <div className="relative z-10 pt-56 sm:pt-72 lg:max-w-3xl lg:pt-0 xl:max-w-4xl">
            {settings?.availableForWork && (
              <Badge
                variant="outline"
                className="label mb-8 h-7 animate-fade-up gap-1.5 rounded-full px-3 font-medium"
              >
                <Sparkles className="text-success" />
                Open to new opportunities
              </Badge>
            )}

            <h1 className="animate-fade-up text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-medium tracking-tighter text-balance [animation-delay:80ms]">
              <Headline text={settings?.headline ?? "Media engineer crafting digital products."} />
            </h1>

            {settings?.intro && (
              <p className="mt-10 max-w-xl animate-fade-up text-lg text-pretty text-muted-foreground [animation-delay:160ms] sm:text-xl">
                {settings.intro}
              </p>
            )}
            <div className="mt-8 flex animate-fade-up gap-3 [animation-delay:200ms]">
              <Button asChild size="lg" className="h-11 rounded-full px-6">
                <Link href="/projects">
                  See my projects <ArrowDownRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-11 rounded-full px-6">
                <Link href="/about">About me</Link>
              </Button>
            </div>
          </div>

          <div className="pointer-events-none absolute -bottom-16 left-1/2 h-[calc(100%+4rem)] -translate-x-[60%] opacity-50 select-none sm:opacity-70 lg:right-0 lg:left-auto lg:h-[calc(100%+9rem)] lg:translate-x-0 lg:opacity-100">
            <Image
              src={heroImage}
              alt={`${settings?.name ?? "Lucas Ahlgren"} with a laptop, phone and camera`}
              priority
              placeholder="blur"
              sizes="(min-width: 1024px) 520px, 560px"
              className="hero-fade h-full w-auto max-w-none animate-fade-up [animation-delay:240ms] dark:brightness-95"
            />
          </div>
        </div>
      </section>

      {settings?.skills && settings.skills.length > 0 && <Marquee items={settings.skills} />}

      <section className="container-page pt-24 sm:pt-32">
        <SectionHeading
          eyebrow="Selected projects"
          title={
            <>
              Things I&apos;ve <span className="font-serif font-normal italic">made</span>
            </>
          }
          href="/projects"
          linkLabel="All projects"
        />
        {first ? (
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            <Reveal className="md:col-span-2">
              <ProjectCard project={first} priority size="large" />
            </Reveal>
            {rest.map((project, i) => (
              <Reveal key={project._id} delay={(i % 2) * 150}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState type="projects" />
        )}
      </section>

      {jobs.length > 0 && (
        <section className="container-page pt-24 sm:pt-32">
          <SectionHeading
            eyebrow="Experience"
            title="Where I've worked"
            href="/experience"
            linkLabel="Full experience"
          />
          <JobList jobs={jobs} compact />
        </section>
      )}

      {photos.length > 0 && (
        <section className="container-page pt-24 sm:pt-32">
          <SectionHeading
            eyebrow="Photography"
            title={
              <>
                Through the <span className="font-serif font-normal italic">lens</span>
              </>
            }
            href="/photography"
            linkLabel="Gallery"
          />
          <WheelCarousel opts={{ align: "start", dragFree: true }}>
            <CarouselContent>
              {photos.map((photo) => {
                const ratio = Math.min(
                  Math.max(photo.image.dimensions?.aspectRatio ?? 0.8, 0.5),
                  2,
                );
                return (
                  <CarouselItem key={photo._id} className="basis-auto">
                    <Link
                      href="/photography"
                      style={{ aspectRatio: ratio }}
                      className="group relative block h-64 max-w-[85vw] overflow-hidden rounded-xl bg-muted sm:h-84 lg:h-96"
                    >
                      <SanityImage
                        image={photo.image}
                        alt={photo.title}
                        fill
                        sizes={`(min-width: 1024px) ${Math.round(384 * ratio)}px, (min-width: 640px) ${Math.round(336 * ratio)}px, 85vw`}
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </Link>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <div className="mt-6 flex justify-end gap-2">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </WheelCarousel>
        </section>
      )}
    </>
  );
}

function Headline({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("*") && part.endsWith("*") ? (
          <span key={i} className="font-serif font-normal italic">
            {part.slice(1, -1)}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
