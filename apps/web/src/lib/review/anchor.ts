import type { ReviewComment } from "@portfolio/content";

import type { CodeToken, ReviewFile, ReviewThread } from "./types";

export const lineText = (tokens: CodeToken[]) => tokens.map(([text]) => text).join("");

export type AnchoredThreads = {
  byFile: Map<string, Map<number, ReviewThread[]>>;
  outdated: ReviewThread[];
  byId: Map<string, ReviewThread>;
};

export function anchorThreads(files: ReviewFile[], comments: ReviewComment[]): AnchoredThreads {
  const replies = new Map<string, ReviewComment[]>();
  for (const comment of comments) {
    if (!comment.parentId) continue;
    replies.set(comment.parentId, [...(replies.get(comment.parentId) ?? []), comment]);
  }

  const result: AnchoredThreads = { byFile: new Map(), outdated: [], byId: new Map() };

  for (const root of comments) {
    if (root.parentId) continue;
    const thread = { root, replies: replies.get(root._id) ?? [] };
    result.byId.set(root._id, thread);

    const file = files.find((f) => f.path === root.filePath);
    const line = file ? findLine(file, root.line, root.lineText) : null;
    if (!file || !line) {
      result.outdated.push(thread);
      continue;
    }

    const lines = result.byFile.get(file.path) ?? new Map<number, ReviewThread[]>();
    lines.set(line, [...(lines.get(line) ?? []), thread]);
    result.byFile.set(file.path, lines);
  }

  return result;
}

function findLine(file: ReviewFile, line: number, text: string) {
  const target = text.trim();
  const matches = (index: number) => lineText(file.lines[index] ?? []).trim() === target;

  if (matches(line - 1)) return line;
  if (!target) return null;

  for (let distance = 1; distance < file.lines.length; distance++) {
    if (matches(line - 1 - distance)) return line - distance;
    if (matches(line - 1 + distance)) return line + distance;
  }
  return null;
}
