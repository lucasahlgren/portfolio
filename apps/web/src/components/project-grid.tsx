"use client";

import { categoryLabel } from "@portfolio/content";
import type { ProjectCard as ProjectCardType } from "@portfolio/content/types";
import { useState } from "react";

import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export function ProjectGrid({ projects }: { projects: ProjectCardType[] }) {
  const [category, setCategory] = useState("all");

  const categories = [...new Set(projects.map((p) => p.category).filter(Boolean))] as string[];
  const visible = category === "all" ? projects : projects.filter((p) => p.category === category);

  return (
    <>
      {categories.length > 1 && (
        <ToggleGroup
          type="single"
          variant="outline"
          value={category}
          onValueChange={(value) => value && setCategory(value)}
          aria-label="Filter by category"
          className="mb-12 flex-wrap"
        >
          <ToggleGroupItem value="all" className="label rounded-full px-4">
            All <span className="text-muted-foreground tabular-nums">{projects.length}</span>
          </ToggleGroupItem>
          {categories.map((value) => (
            <ToggleGroupItem key={value} value={value} className="label rounded-full px-4">
              {categoryLabel(value)}{" "}
              <span className="text-muted-foreground tabular-nums">
                {projects.filter((p) => p.category === value).length}
              </span>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      )}
      <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
        {visible.map((project, i) => (
          <Reveal key={`${category}-${project._id}`} delay={(i % 2) * 150}>
            <ProjectCard project={project} priority={i < 2} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
