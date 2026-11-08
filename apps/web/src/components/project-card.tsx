import { categoryLabel } from "@portfolio/content";
import type { ProjectCard as ProjectCardType } from "@portfolio/content/types";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";

import { SanityImage } from "@/components/sanity-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { categoryIcons } from "@/lib/category-icons";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  className,
  priority,
  size = "default",
}: {
  project: ProjectCardType;
  className?: string;
  priority?: boolean;
  size?: "default" | "large";
}) {
  const category = categoryLabel(project.category);
  const CategoryIcon = project.category ? categoryIcons[project.category] : null;
  const accent = { "--project-accent": project.accentColor ?? "var(--brand)" } as CSSProperties;

  return (
    <Link
      href={`/projects/${project.slug}`}
      style={accent}
      className={cn("group block rounded-2xl focus-visible:outline-none", className)}
    >
      <Card className="gap-0 overflow-visible rounded-2xl bg-transparent py-0 shadow-none ring-0 group-focus-visible:ring-2 group-focus-visible:ring-ring">
        <div className="overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/5">
          <AspectRatio ratio={size === "large" ? 16 / 10 : 4 / 3}>
            <SanityImage
              image={project.coverImage}
              alt={project.title}
              fill
              priority={priority}
              sizes={
                size === "large"
                  ? "(min-width: 1024px) 60vw, 100vw"
                  : "(min-width: 768px) 50vw, 100vw"
              }
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
            />
            <span className="absolute top-4 right-4 grid size-10 translate-y-2 place-items-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <ArrowUpRight className="size-4" />
            </span>
          </AspectRatio>
        </div>
        <CardHeader className="px-0 pt-4">
          <CardTitle className="text-lg tracking-tight">{project.title}</CardTitle>
          {project.subtitle && (
            <CardDescription className="text-base">{project.subtitle}</CardDescription>
          )}
          {(category || project.year) && (
            <CardAction className="flex items-center gap-1.5">
              {category && CategoryIcon && (
                <Badge variant="outline" className="label gap-1.5 rounded-full font-medium">
                  <CategoryIcon className="text-[var(--project-accent)]" aria-hidden="true" />
                  {category}
                </Badge>
              )}
              {project.year && (
                <Badge variant="secondary" className="label rounded-full font-medium tabular-nums">
                  {project.year}
                </Badge>
              )}
            </CardAction>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
