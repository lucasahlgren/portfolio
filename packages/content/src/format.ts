import {
  EMPLOYMENT_TYPES,
  PROJECT_CATEGORIES,
  PROJECT_KINDS,
  type EmploymentType,
  type Job,
} from "./types";

const monthYear = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" });

export function formatJobPeriod(job: Pick<Job, "startDate" | "endDate">): string {
  const start = monthYear.format(new Date(job.startDate));
  const end = job.endDate ? monthYear.format(new Date(job.endDate)) : "Present";
  return `${start} — ${end}`;
}

export function formatYearRange(start: number, end: number | null | undefined): string {
  if (end === start) return String(start);
  return `${start} — ${end ?? "Present"}`;
}

export function kindLabel(value: string | null | undefined): string | null {
  return PROJECT_KINDS.find((k) => k.value === value)?.title ?? null;
}

export function categoryLabel(value: string | null | undefined): string | null {
  return PROJECT_CATEGORIES.find((c) => c.value === value)?.title ?? null;
}

export function employmentTypeLabel(value: EmploymentType | null | undefined): string | null {
  return EMPLOYMENT_TYPES.find((t) => t.value === value)?.title ?? null;
}
