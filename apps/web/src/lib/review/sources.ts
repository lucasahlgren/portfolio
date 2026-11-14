import { REVIEW_SECTIONS, type ReviewSectionKey } from "@portfolio/content";

import snapshotJson from "@/generated/review-sources.json";

import type { ReviewFile } from "./types";

type Snapshot = {
  sha: string;
  repoUrl: string | null;
  pathPrefix: string;
  sections: Record<ReviewSectionKey, string[]>;
  files: Record<string, Omit<ReviewFile, "path">>;
};

const snapshot = snapshotJson as unknown as Snapshot;

export const reviewSnapshot = {
  sha: snapshot.sha,
  repoUrl: snapshot.repoUrl,
  pathPrefix: snapshot.pathPrefix,
};

export const isReviewSection = (value: string): value is ReviewSectionKey =>
  REVIEW_SECTIONS.some((s) => s.value === value);

export const reviewSectionTitle = (section: ReviewSectionKey) =>
  REVIEW_SECTIONS.find((s) => s.value === section)?.title ?? section;

export const getSectionFiles = (section: ReviewSectionKey): ReviewFile[] =>
  (snapshot.sections[section] ?? []).flatMap((path) => {
    const file = snapshot.files[path];
    return file ? [{ path, ...file }] : [];
  });
