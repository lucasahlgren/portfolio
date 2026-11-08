import { categoryLabel, kindLabel } from "@portfolio/content";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment, Suspense, type CSSProperties } from "react";

import { PortableText } from "@/components/portable-text";
import { SanityImage } from "@/components/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { VideoEmbed } from "@/components/video-embed";
import { categoryIcons } from "@/lib/category-icons";
import { imageUrl } from "@/lib/sanity/image";
import { getProject, getProjects, getProjectSlugs } from "@/lib/sanity/queries";

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.length ? slugs.map((slug) => ({ slug })) : [{ slug: "placeholder" }];
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  const image = imageUrl(project.coverImage, 1200);
  return {
    title: project.title,
    description: project.excerpt ?? project.subtitle ?? undefined,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: image ? { images: [{ url: image, width: 1200 }] } : undefined,
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<ProjectSkeleton />}>
      <Project params={params} />
    </Suspense>
  );
}

function ProjectSkeleton() {
  return (
    <div className="container-page pt-10 sm:pt-16" aria-busy="true">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="mt-12 h-3 w-40" />
      <Skeleton className="mt-5 h-14 w-full max-w-3xl sm:h-20" />
      <Skeleton className="mt-6 h-6 w-full max-w-xl" />
      <Skeleton className="mt-12 aspect-[16/9] w-full rounded-2xl" />
    </div>
  );
}

async function Project({ params }: Pick<PageProps<"/projects/[slug]">, "params">) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProject(slug), getProjects()]);
  if (!project) notFound();

  const index = all.findIndex((p) => p.slug === slug);
  const next = all.length > 1 ? all[(index + 1) % all.length] : null;
  const accent = { "--project-accent": project.accentColor ?? "var(--brand)" } as CSSProperties;
  const CategoryIcon = project.category ? categoryIcons[project.category] : null;

  const facts = [
    { label: "Type", value: kindLabel(project.kind) },
    { label: "Year", value: project.year?.toString() },
    { label: "Category", value: categoryLabel(project.category) },
    { label: "Role", value: project.role },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  const sidebar = [
    facts.length > 0 && (
      <dl key="facts" className="space-y-3">
        {facts.map((fact) => (
          <div key={fact.label} className="flex justify-between gap-4 text-sm">
            <dt className="text-muted-foreground">{fact.label}</dt>
            <dd className="text-right">{fact.value}</dd>
          </div>
        ))}
      </dl>
    ),
    project.tools && project.tools.length > 0 && (
      <div key="tools">
        <p className="eyebrow mb-3">Tools</p>
        <div className="flex flex-wrap gap-1.5">
          {project.tools.map((tool) => (
            <Badge key={tool} variant="secondary" className="rounded-full font-normal">
              {tool}
            </Badge>
          ))}
        </div>
      </div>
    ),
    project.team && project.team.length > 0 && (
      <div key="team">
        <p className="eyebrow mb-3">Team</p>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {project.team.map((member) => (
            <li key={member}>{member}</li>
          ))}
        </ul>
      </div>
    ),
    project.links && project.links.length > 0 && (
      <div key="links" className="flex flex-col gap-2">
        <p className="eyebrow mb-1">Links</p>
        {project.links.map((link) => (
          <Button
            key={link._key}
            asChild
            variant="outline"
            className="group justify-between rounded-full"
          >
            <a href={link.url} target="_blank" rel="noreferrer">
              {link.label}
              <ArrowUpRight className="text-[var(--project-accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </Button>
        ))}
      </div>
    ),
  ].filter(Boolean);

  return (
    <article style={accent}>
      <header className="container-page pt-10 pb-12 sm:pt-16">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/projects">Projects</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1">{project.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <p className="eyebrow mt-12 flex items-center gap-2">
          {CategoryIcon && (
            <CategoryIcon className="size-3.5 text-[var(--project-accent)]" aria-hidden="true" />
          )}
          {project.subtitle}
        </p>
        <h1 className="mt-4 max-w-5xl animate-fade-up text-5xl font-medium tracking-tighter text-balance sm:text-7xl">
          {project.title}
        </h1>
        {project.excerpt && (
          <p className="mt-6 max-w-2xl animate-fade-up text-xl text-pretty text-muted-foreground [animation-delay:80ms]">
            {project.excerpt}
          </p>
        )}
      </header>

      <div className="container-page">
        {project.videoUrl ? (
          <VideoEmbed url={project.videoUrl} title={project.title} />
        ) : (
          <div className="overflow-hidden rounded-2xl bg-muted">
            <AspectRatio ratio={16 / 9}>
              <SanityImage
                image={project.coverImage}
                alt={project.title}
                fill
                priority
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-cover"
              />
            </AspectRatio>
          </div>
        )}
      </div>

      <div className="container-page mt-16 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-20">
        <div className="max-w-2xl">
          <PortableText value={project.body} />
        </div>

        {sidebar.length > 0 && (
          <Card className="rounded-2xl lg:sticky lg:top-24 lg:self-start">
            <CardContent className="flex flex-col gap-5">
              {sidebar.map((section, i) => (
                <Fragment key={i}>
                  {i > 0 && <Separator />}
                  {section}
                </Fragment>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {project.gallery && project.gallery.length > 0 && (
        <div className="container-page mt-20">
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {project.gallery.map((image, i) => (
                <CarouselItem key={image.asset?._ref ?? i}>
                  <SanityImage
                    image={image}
                    sizes="(min-width: 1280px) 1216px, 100vw"
                    className="h-auto w-full rounded-2xl"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {project.gallery.length > 1 && (
              <>
                <CarouselPrevious className="left-4" />
                <CarouselNext className="right-4" />
              </>
            )}
          </Carousel>
        </div>
      )}

      {next && (
        <div className="container-page mt-24">
          <Link href={`/projects/${next.slug}`} className="group block">
            <Card className="rounded-2xl transition-colors group-hover:bg-muted/50">
              <CardHeader>
                <CardDescription className="eyebrow">Next project</CardDescription>
                <CardTitle className="flex items-center justify-between gap-6 text-3xl font-medium tracking-tighter sm:text-5xl">
                  {next.title}
                  <ArrowRight className="size-8 shrink-0 text-brand transition-transform group-hover:translate-x-2 sm:size-12" />
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>
      )}
    </article>
  );
}
