import type { ReviewSectionKey } from "@portfolio/content";
import type { ReactNode } from "react";

import { reviewSectionTitle } from "@/lib/review/sources";
import { getReviewConfig } from "@/lib/sanity/queries";

import { ReviewModeToggle } from "./review-mode-toggle";
import { ReviewTrigger } from "./review-trigger";

async function getEnabledSection(section: ReviewSectionKey) {
  const config = await getReviewConfig();
  return config.enabled ? config.sections.find((entry) => entry.section === section) : undefined;
}

export async function ReviewButton({
  section,
  compact,
}: {
  section: ReviewSectionKey;
  compact?: boolean;
}) {
  const entry = await getEnabledSection(section);
  if (!entry) return null;

  return (
    <ReviewTrigger
      section={section}
      title={reviewSectionTitle(section)}
      commentCount={entry.commentCount}
      compact={compact}
    />
  );
}

export async function ReviewMode() {
  const config = await getReviewConfig();
  return config.enabled && config.sections.length > 0 ? <ReviewModeToggle /> : null;
}

export async function ReviewableSection({
  section,
  children,
}: {
  section: ReviewSectionKey;
  children: ReactNode;
}) {
  const entry = await getEnabledSection(section);
  if (!entry) return children;

  return (
    <div
      className="relative"
      data-review-section={section}
      data-review-label={reviewSectionTitle(section)}
    >
      {children}
      <div className="pointer-events-none absolute inset-x-0 top-6 hidden [[data-review-mode]_&]:block">
        <div className="container-page flex justify-end">
          <div className="pointer-events-auto">
            <ReviewTrigger
              section={section}
              title={reviewSectionTitle(section)}
              commentCount={entry.commentCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
