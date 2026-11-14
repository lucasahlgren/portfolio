import { REVIEW_SECTIONS } from "@portfolio/content";

import { getSectionFiles, isReviewSection, reviewSnapshot } from "@/lib/review/sources";
import type { ReviewPanelData } from "@/lib/review/types";
import { getReviewComments, getReviewConfig } from "@/lib/sanity/queries";

export async function generateStaticParams() {
  return REVIEW_SECTIONS.map(({ value }) => ({ section: value }));
}

export async function GET(_request: Request, { params }: RouteContext<"/api/review/[section]">) {
  const { section } = await params;
  if (!isReviewSection(section)) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const config = await getReviewConfig();
  const settings = config.enabled
    ? config.sections.find((entry) => entry.section === section)
    : undefined;
  if (!settings) {
    return Response.json({ message: "Not found" }, { status: 404 });
  }

  const comments = await getReviewComments(section);

  return Response.json({
    section,
    intro: config.intro,
    prompt: settings.prompt,
    pinnedCommentId: settings.pinnedCommentId,
    ...reviewSnapshot,
    files: getSectionFiles(section),
    comments,
  } satisfies ReviewPanelData);
}
