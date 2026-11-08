import { formatYearRange } from "@portfolio/content";
import type { Metadata } from "next";
import { Fragment } from "react";

import { EmptyState } from "@/components/empty-state";
import { JobList } from "@/components/job-list";
import { LogoAvatar } from "@/components/logo-avatar";
import { PageHeader, SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { getEducation, getJobs } from "@/lib/sanity/queries";

export const metadata: Metadata = {
  title: "Experience",
  description: "Work experience and education.",
  alternates: { canonical: "/experience" },
};

export default async function ExperiencePage() {
  const [jobs, education] = await Promise.all([getJobs(), getEducation()]);

  return (
    <>
      <PageHeader
        eyebrow="Experience"
        title={
          <>
            Work &amp; <span className="font-serif font-normal italic">education</span>
          </>
        }
      >
        Where I&apos;ve worked, what I&apos;ve built there and where I learned to do it.
      </PageHeader>

      <section className="container-page" aria-labelledby="jobs">
        <h2 id="jobs" className="sr-only">
          Jobs
        </h2>
        {jobs.length > 0 ? <JobList jobs={jobs} /> : <EmptyState type="jobs" />}
      </section>

      <section className="container-page pt-24 sm:pt-32">
        <SectionHeading eyebrow="Education" title="Studies" />
        {education.length > 0 ? (
          <ItemGroup className="gap-0">
            {education.map((item, i) => (
              <Fragment key={item._id}>
                {i > 0 && <ItemSeparator />}
                <Item className="items-start gap-4 px-0 py-6 sm:py-8">
                  <ItemMedia>
                    <LogoAvatar logo={item.logo} name={item.school} />
                  </ItemMedia>
                  <ItemContent className="gap-1">
                    <ItemTitle className="text-xl font-medium tracking-tight">
                      {item.school}
                    </ItemTitle>
                    <ItemDescription className="line-clamp-none text-base text-foreground/80">
                      {item.degree}
                    </ItemDescription>
                    {item.location && (
                      <p className="text-sm text-muted-foreground">{item.location}</p>
                    )}
                    {item.description && (
                      <p className="mt-2 max-w-2xl text-base text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                  </ItemContent>
                  <ItemActions>
                    <Badge
                      variant="outline"
                      className="label rounded-full font-medium tabular-nums"
                    >
                      {formatYearRange(item.startYear, item.endYear)}
                    </Badge>
                  </ItemActions>
                </Item>
              </Fragment>
            ))}
          </ItemGroup>
        ) : (
          <EmptyState type="education" />
        )}
      </section>
    </>
  );
}
