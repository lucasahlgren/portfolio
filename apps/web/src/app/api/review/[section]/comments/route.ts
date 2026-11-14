import { createHash, randomBytes, randomUUID } from "node:crypto";

import type { ReviewComment } from "@portfolio/content";
import { checkBotId } from "botid/server";

import { lineText } from "@/lib/review/anchor";
import { parseCommentInput, REVIEW_LIMITS } from "@/lib/review/limits";
import { getSectionFiles, isReviewSection, reviewSnapshot } from "@/lib/review/sources";
import { getReviewConfig, getSettings } from "@/lib/sanity/queries";
import { reviewHashSalt, reviewWriteClient } from "@/lib/sanity/write-client";

type Anchor = Pick<ReviewComment, "filePath" | "line" | "commitSha" | "lineText" | "context">;

const fail = (message: string, status: number) => Response.json({ message }, { status });

function submitterHash(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  return createHash("sha256").update(`${reviewHashSalt}:${ip}`).digest("hex");
}

export async function POST(
  request: Request,
  { params }: RouteContext<"/api/review/[section]/comments">,
) {
  const { section } = await params;
  if (!isReviewSection(section)) return fail("This part of the site isn't open for review.", 404);
  if (!reviewWriteClient)
    return fail("Comments are closed right now. Please try again later.", 503);

  const verification = await checkBotId();
  if (verification.isBot) return fail("Your comment couldn't be sent. Please try again.", 403);

  const parsed = parseCommentInput(await request.json().catch(() => null));
  if (!parsed.ok) return fail(parsed.message, 400);
  const input = parsed.input;

  if (input.website) return Response.json({ comment: null }, { status: 202 });
  if (!input.startedAt || Date.now() - input.startedAt < REVIEW_LIMITS.minFillMs) {
    return fail("That was quick! Take a moment and try again.", 400);
  }

  const [config, settings] = await Promise.all([getReviewConfig(), getSettings()]);
  if (!config.enabled || !config.sections.some((entry) => entry.section === section)) {
    return fail("This part of the site isn't open for review.", 404);
  }
  if (settings?.name && input.name.toLowerCase() === settings.name.toLowerCase()) {
    return fail("Please use your own name.", 400);
  }

  const hash = submitterHash(request);
  const pending = await reviewWriteClient.fetch<number>(
    `count(*[_type == "reviewComment" && _id in path("drafts.**") && submitterHash == $hash])`,
    { hash },
  );
  if (pending >= REVIEW_LIMITS.pendingMax) {
    return fail(
      "You already have several comments waiting for approval. Please wait until they've been read.",
      429,
    );
  }

  let anchor: Anchor;
  if (input.parentId) {
    const parent = await reviewWriteClient.fetch<Anchor | null>(
      `*[_type == "reviewComment" && _id == $id && section == $section && !defined(parent)][0]{
        filePath, line, commitSha, lineText, context
      }`,
      { id: input.parentId, section },
    );
    if (!parent) return fail("This thread no longer exists.", 404);
    anchor = parent;
  } else {
    const file = getSectionFiles(section).find((f) => f.path === input.filePath);
    if (!file || input.line < 1 || input.line > file.lines.length) {
      return fail("That line doesn't exist in this code anymore. Reload and try again.", 400);
    }
    anchor = {
      filePath: file.path,
      line: input.line,
      commitSha: reviewSnapshot.sha,
      lineText: lineText(file.lines[input.line - 1]),
      context: file.lines
        .slice(Math.max(0, input.line - 2), input.line + 1)
        .map(lineText)
        .join("\n"),
    };
  }

  const id = randomUUID();
  const deleteToken = randomBytes(24).toString("base64url");
  const author = { name: input.name, url: input.url };

  const thread: Record<string, unknown> = input.parentId
    ? { parent: { _type: "reference", _ref: input.parentId, _weak: true } }
    : { status: "open" };

  await reviewWriteClient.create({
    _id: `drafts.${id}`,
    _type: "reviewComment",
    section,
    ...anchor,
    author,
    body: input.body,
    isOwner: false,
    submitterHash: hash,
    deleteTokenHash: createHash("sha256").update(deleteToken).digest("hex"),
    ...thread,
  });

  const comment: ReviewComment = {
    _id: id,
    _createdAt: new Date().toISOString(),
    section,
    ...anchor,
    author,
    body: input.body,
    parentId: input.parentId,
    isOwner: false,
    status: input.parentId ? null : "open",
    fixedInCommit: null,
    statusNote: null,
  };

  return Response.json({ comment, deleteToken }, { status: 201 });
}
