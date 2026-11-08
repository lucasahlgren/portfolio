import type { Metadata } from "next";

import { EmptyState } from "@/components/empty-state";
import { ProjectGrid } from "@/components/project-grid";
import { PageHeader, SectionHeading } from "@/components/section-heading";
import { getProjects } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects from my studies in media technology and from my spare time, from data visualisation and web apps to games, AR, design and motion.",
  alternates: { canonical: "/projects" },
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  const school = projects.filter((p) => p.kind !== "personal");
  const personal = projects.filter((p) => p.kind === "personal");

  return (
    <>
      <PageHeader
        eyebrow={`Projects · ${String(projects.length).padStart(2, "0")}`}
        title={
          <>
            Things I&apos;ve <span className="font-serif font-normal italic">made</span>
          </>
        }
      >
        Projects from my studies in media technology at KTH and from my spare time, from data
        visualisation and web apps to games, AR, design and motion.
      </PageHeader>

      {projects.length === 0 && (
        <section className="container-page">
          <EmptyState type="projects" />
        </section>
      )}

      {school.length > 0 && (
        <section className="container-page" aria-labelledby="school-projects">
          <SectionHeading
            id="school-projects"
            eyebrow={`School · ${String(school.length).padStart(2, "0")}`}
            title={
              <>
                School <span className="font-serif font-normal italic">projects</span>
              </>
            }
          />
          <ProjectGrid projects={school} />
        </section>
      )}

      {personal.length > 0 && (
        <section className="container-page pt-24 sm:pt-32" aria-labelledby="spare-time-projects">
          <SectionHeading
            id="spare-time-projects"
            eyebrow={`Spare time · ${String(personal.length).padStart(2, "0")}`}
            title={
              <>
                Spare time <span className="font-serif font-normal italic">projects</span>
              </>
            }
          />
          <ProjectGrid projects={personal} />
        </section>
      )}
    </>
  );
}
