import { employmentTypeLabel, formatJobPeriod } from "@portfolio/content";
import type { Job } from "@portfolio/content/types";
import { ArrowUpRight } from "lucide-react";
import { Fragment } from "react";

import { LogoAvatar } from "@/components/logo-avatar";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

export function JobList({ jobs, compact = false }: { jobs: Job[]; compact?: boolean }) {
  return (
    <ItemGroup className="gap-0">
      {jobs.map((job, i) => {
        const current = !job.endDate;
        const type = employmentTypeLabel(job.employmentType);
        return (
          <Fragment key={job._id}>
            {i > 0 && <ItemSeparator />}
            <Item className="items-start gap-4 px-0 py-6 sm:py-8">
              <ItemMedia>
                <LogoAvatar logo={job.logo} name={job.company} />
              </ItemMedia>
              <ItemContent className="gap-1">
                <ItemTitle className="text-xl font-medium tracking-tight">{job.role}</ItemTitle>
                <ItemDescription className="line-clamp-none text-base">
                  {job.url ? (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group/link inline-flex items-center gap-1 text-foreground no-underline hover:text-brand"
                    >
                      {job.company}
                      <ArrowUpRight className="size-3.5 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                    </a>
                  ) : (
                    <span className="text-foreground">{job.company}</span>
                  )}
                  {[job.location, type].filter(Boolean).map((part) => (
                    <span key={part}> · {part}</span>
                  ))}
                </ItemDescription>
                {job.summary && (
                  <p className="mt-2 max-w-2xl text-base text-muted-foreground">{job.summary}</p>
                )}
                {!compact && job.highlights && job.highlights.length > 0 && (
                  <ul className="mt-3 max-w-2xl space-y-1.5 text-base text-muted-foreground">
                    {job.highlights.map((h) => (
                      <li key={h} className="flex gap-3">
                        <span className="mt-3 h-px w-3 shrink-0 bg-brand" aria-hidden="true" />
                        {h}
                      </li>
                    ))}
                  </ul>
                )}
              </ItemContent>
              <ItemActions className="hidden sm:flex">
                <PeriodBadge period={formatJobPeriod(job)} current={current} />
              </ItemActions>
              <ItemFooter className="flex-wrap justify-start gap-1.5 pl-16 sm:hidden">
                <PeriodBadge period={formatJobPeriod(job)} current={current} />
              </ItemFooter>
              {!compact && job.tools && job.tools.length > 0 && (
                <ItemFooter className="flex-wrap justify-start gap-1.5 sm:pl-16">
                  {job.tools.map((tool) => (
                    <Badge
                      key={tool}
                      variant="secondary"
                      className="label rounded-full font-medium"
                    >
                      {tool}
                    </Badge>
                  ))}
                </ItemFooter>
              )}
            </Item>
          </Fragment>
        );
      })}
    </ItemGroup>
  );
}

function PeriodBadge({ period, current }: { period: string; current: boolean }) {
  return (
    <Badge
      variant="outline"
      aria-label={current ? `${period}, current position` : undefined}
      className={cn(
        "label rounded-full font-medium tabular-nums",
        current && "border-success/40 bg-success/10 text-success",
      )}
    >
      {period}
    </Badge>
  );
}
