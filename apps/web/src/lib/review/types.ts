import type { ReviewComment, ReviewSectionKey } from "@portfolio/content";

export type CodeToken = [text: string, light: string, dark: string];

export type ReviewFile = { path: string; lang: string; lines: CodeToken[][] };

export type ReviewPanelData = {
  section: ReviewSectionKey;
  intro: string | null;
  prompt: string | null;
  pinnedCommentId: string | null;
  sha: string;
  repoUrl: string | null;
  pathPrefix: string;
  files: ReviewFile[];
  comments: ReviewComment[];
};

export type ReviewThread = { root: ReviewComment; replies: ReviewComment[] };
