"use client";

import type { ReviewComment, ReviewSectionKey } from "@portfolio/content";
import { Clock, GitCommitHorizontal, History, Link2, Pin, Plus, Reply, Trash2 } from "lucide-react";
import { Fragment, use, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { anchorThreads } from "@/lib/review/anchor";
import {
  forgetOwned,
  forgetPending,
  readOwned,
  readPending,
  reviewLink,
  type ReviewTarget,
} from "@/lib/review/browser";
import type { ReviewFile, ReviewPanelData, ReviewThread } from "@/lib/review/types";
import { cn } from "@/lib/utils";

import { CommentForm } from "./comment-form";

type Draft = { filePath: string; line: number; parentId?: string };

type ReviewContext = {
  section: ReviewSectionKey;
  repoUrl: string | null;
  pendingIds: Set<string>;
  draft: Draft | null;
  setDraft: (draft: Draft | null) => void;
  onPosted: (comment: ReviewComment) => void;
  canDelete: (comment: ReviewComment) => boolean;
  onDelete: (comment: ReviewComment) => Promise<void>;
};

const shortSha = (sha: string) => sha.slice(0, 7);

const dateFormat = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export function ReviewPanel({
  request,
  target,
}: {
  request: Promise<ReviewPanelData | null>;
  target: ReviewTarget | null;
}) {
  const data = use(request);

  if (!data) {
    return (
      <p className="p-4 text-muted-foreground">
        This code couldn&apos;t be loaded right now. Try again in a moment.
      </p>
    );
  }

  return <PanelContent data={data} target={target} />;
}

function PanelContent({ data, target }: { data: ReviewPanelData; target: ReviewTarget | null }) {
  const [pending, setPending] = useState(() =>
    readPending(data.section, new Set(data.comments.map((comment) => comment._id))),
  );
  const [draft, setDraft] = useState<Draft | null>(null);
  const [owned, setOwned] = useState(readOwned);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(() => new Set());
  const [activePath, setActivePath] = useState(() =>
    target?.file && data.files.some((file) => file.path === target.file)
      ? target.file
      : data.files[0]?.path,
  );

  const pendingKey = pending.map((comment) => comment._id).join(",");
  useEffect(() => {
    if (!pendingKey) return;
    let active = true;
    fetch(`/api/review/pending?ids=${pendingKey}`)
      .then((response) => (response.ok ? response.json() : null))
      .then((result: { waiting: string[] | null } | null) => {
        if (!active || !result?.waiting) return;
        const waiting = new Set(result.waiting);
        const removed = pendingKey.split(",").filter((id) => !waiting.has(id));
        if (removed.length === 0) return;
        forgetPending(removed);
        setPending((current) => current.filter((comment) => !removed.includes(comment._id)));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [pendingKey]);

  const comments = useMemo(
    () =>
      data.comments.filter(
        (comment) =>
          !deletedIds.has(comment._id) && !(comment.parentId && deletedIds.has(comment.parentId)),
      ),
    [data.comments, deletedIds],
  );
  const pendingIds = useMemo(() => new Set(pending.map((comment) => comment._id)), [pending]);
  const threads = useMemo(
    () => anchorThreads(data.files, [...comments, ...pending]),
    [data.files, comments, pending],
  );

  const activeFile = data.files.find((file) => file.path === activePath) ?? data.files[0];
  const pinned = data.pinnedCommentId ? threads.byId.get(data.pinnedCommentId) : undefined;
  const hasCommit = Boolean(data.repoUrl && data.sha !== "unknown");
  const focusLine = target?.line && target.file === activeFile?.path ? target.line : null;

  const credits = useMemo(() => {
    const seen = new Map<string, ReviewComment["author"]>();
    for (const comment of comments) {
      if (comment.parentId || comment.isOwner) continue;
      if (comment.status !== "fixed" && comment.status !== "til") continue;
      seen.set(comment.author.name.toLowerCase(), comment.author);
    }
    return [...seen.values()];
  }, [comments]);

  const review: ReviewContext = {
    section: data.section,
    repoUrl: data.repoUrl,
    pendingIds,
    draft,
    setDraft,
    onPosted: (comment) => {
      setPending((current) => [...current, comment]);
      setOwned(readOwned());
      setDraft(null);
    },
    canDelete: (comment) => Boolean(owned[comment._id]),
    onDelete: async (comment) => {
      const response = await fetch(`/api/review/${data.section}/comments/${comment._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: owned[comment._id] }),
      }).catch(() => null);
      if (!response?.ok) {
        const result = (await response?.json().catch(() => null)) as { message?: string } | null;
        toast.error(result?.message ?? "Your comment couldn't be deleted. Please try again.");
        return;
      }
      forgetOwned(comment._id);
      forgetPending([comment._id]);
      setOwned(readOwned());
      setPending((current) =>
        current.filter((item) => item._id !== comment._id && item.parentId !== comment._id),
      );
      setDeletedIds((current) => new Set(current).add(comment._id));
      setDraft(null);
      toast.success("Comment deleted");
    },
  };

  return (
    <div className="flex flex-col">
      <div className="space-y-4 p-4">
        {data.intro && <p className="text-pretty text-muted-foreground">{data.intro}</p>}
        {data.prompt && (
          <div className="rounded-lg border bg-muted/40 p-3">
            <p className="eyebrow mb-1.5">What I&apos;d like feedback on</p>
            <p className="text-pretty whitespace-pre-line">{data.prompt}</p>
          </div>
        )}
        {pinned && (
          <div>
            <p className="eyebrow mb-2 flex items-center gap-1.5">
              <Pin className="size-3" /> Pinned
            </p>
            <Thread thread={pinned} line={pinned.root.line} review={review} showLocation />
          </div>
        )}
        {credits.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Thanks for the reviews that improved this code:{" "}
            {credits.map((author, i) => (
              <Fragment key={author.name}>
                {i > 0 && ", "}
                <AuthorName author={author} />
              </Fragment>
            ))}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {comments.length === 0 && pending.length === 0
            ? "No comments yet. Click a line number to start the review."
            : "Click a line number to add a comment."}
        </p>
      </div>

      <div className="sticky top-0 z-10 flex items-center gap-1 overflow-x-auto border-y bg-popover px-2 py-1.5">
        {data.files.map((file) => {
          const count = [...(threads.byFile.get(file.path)?.values() ?? [])].flat().length;
          const active = file.path === activeFile?.path;
          return (
            <button
              key={file.path}
              type="button"
              title={file.path}
              aria-pressed={active}
              onClick={() => {
                setActivePath(file.path);
                setDraft(null);
              }}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-xs transition-colors",
                active ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {file.path.split("/").pop()}
              {count > 0 && (
                <span className="rounded-full bg-foreground/10 px-1.5 text-[10px]">{count}</span>
              )}
            </button>
          );
        })}
        {hasCommit && activeFile && (
          <a
            href={`${data.repoUrl}/blob/${data.sha}/${data.pathPrefix}${activeFile.path}`}
            target="_blank"
            rel="noreferrer"
            title="View this file on GitHub"
            className="ml-auto flex shrink-0 items-center gap-1 px-2 font-mono text-xs text-muted-foreground hover:text-foreground"
          >
            <GitCommitHorizontal className="size-3.5" />
            {shortSha(data.sha)}
          </a>
        )}
      </div>

      {activeFile && (
        <CodeView
          key={activeFile.path}
          file={activeFile}
          threads={threads.byFile.get(activeFile.path)}
          focusLine={focusLine}
          review={review}
        />
      )}

      {threads.outdated.length > 0 && (
        <details className="border-t p-4">
          <summary className="flex cursor-pointer items-center gap-1.5 text-muted-foreground">
            <History className="size-3.5" />
            {threads.outdated.length} outdated{" "}
            {threads.outdated.length === 1 ? "comment" : "comments"}
          </summary>
          <p className="mt-2 text-xs text-muted-foreground">
            The code these comments refer to has changed since they were written.
          </p>
          <div className="mt-4 space-y-4">
            {threads.outdated.map((thread) => (
              <Thread
                key={thread.root._id}
                thread={thread}
                line={thread.root.line}
                review={review}
                showLocation
                showContext
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function CodeView({
  file,
  threads,
  focusLine,
  review,
}: {
  file: ReviewFile;
  threads: Map<number, ReviewThread[]> | undefined;
  focusLine: number | null;
  review: ReviewContext;
}) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!focusLine) return;
    container.current
      ?.querySelector(`[data-line="${focusLine}"]`)
      ?.scrollIntoView({ block: "center" });
  }, [focusLine]);

  return (
    <div ref={container} className="py-2 font-mono text-[12.5px] leading-6">
      {file.lines.map((tokens, index) => {
        const line = index + 1;
        const lineThreads = threads?.get(line);
        const composing =
          review.draft?.filePath === file.path &&
          review.draft.line === line &&
          !review.draft.parentId;
        return (
          <Fragment key={line}>
            <div
              data-line={line}
              className={cn(
                "group/line flex hover:bg-muted/50",
                lineThreads && "bg-brand/5",
                (line === focusLine || composing) && "bg-brand/10",
              )}
            >
              <button
                type="button"
                aria-label={`Comment on line ${line}`}
                onClick={() => review.setDraft({ filePath: file.path, line })}
                className="relative w-14 shrink-0 pr-3 text-right text-muted-foreground/60 select-none hover:text-foreground"
              >
                <Plus className="absolute top-1/2 left-1.5 size-4 -translate-y-1/2 rounded-sm bg-primary p-0.5 text-primary-foreground opacity-0 transition-opacity group-hover/line:opacity-100" />
                {line}
              </button>
              <code className="min-w-0 flex-1 pr-4 [overflow-wrap:anywhere] whitespace-pre-wrap">
                {tokens.length === 0
                  ? " "
                  : tokens.map(([text, light, dark], i) => (
                      <span
                        key={i}
                        style={{ "--shiki-light": light, "--shiki-dark": dark } as CSSProperties}
                        className={
                          light ? "text-(--shiki-light) dark:text-(--shiki-dark)" : undefined
                        }
                      >
                        {text}
                      </span>
                    ))}
              </code>
            </div>
            {(lineThreads || composing) && (
              <div className="space-y-2 border-y bg-muted/30 px-3 py-3 sm:pl-14">
                {lineThreads?.map((thread) => (
                  <Thread key={thread.root._id} thread={thread} line={line} review={review} />
                ))}
                {composing && (
                  <CommentForm
                    section={review.section}
                    filePath={file.path}
                    line={line}
                    onCancel={() => review.setDraft(null)}
                    onPosted={review.onPosted}
                  />
                )}
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}

function Thread({
  thread,
  line,
  review,
  showLocation,
  showContext,
}: {
  thread: ReviewThread;
  line: number;
  review: ReviewContext;
  showLocation?: boolean;
  showContext?: boolean;
}) {
  const { root, replies } = thread;
  const rootPending = review.pendingIds.has(root._id);
  const replying = review.draft?.parentId === root._id;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(reviewLink(review.section, root.filePath, line));
      toast.success("Link copied");
    } catch {
      toast.error("The link couldn't be copied.");
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card font-sans text-sm leading-normal">
      {showLocation && (
        <div className="border-b bg-muted/40 px-3 py-1.5 font-mono text-xs text-muted-foreground">
          {root.filePath}:{root.line}
        </div>
      )}
      {showContext && (root.context || root.lineText) && (
        <pre className="overflow-x-auto border-b px-3 py-2 font-mono text-xs text-muted-foreground">
          {root.context || root.lineText}
        </pre>
      )}
      <Comment comment={root} review={review} />
      {replies.map((reply) => (
        <Comment key={reply._id} comment={reply} review={review} className="border-t" />
      ))}
      {replying ? (
        <CommentForm
          section={review.section}
          filePath={root.filePath}
          line={root.line}
          parentId={root._id}
          onCancel={() => review.setDraft(null)}
          onPosted={review.onPosted}
          className="rounded-none border-x-0 border-b-0"
        />
      ) : (
        !rootPending && (
          <div className="flex gap-1 border-t px-2 py-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={() =>
                review.setDraft({ filePath: root.filePath, line: root.line, parentId: root._id })
              }
            >
              <Reply /> Reply
            </Button>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={copyLink}>
              <Link2 /> Copy link
            </Button>
          </div>
        )
      )}
    </div>
  );
}

function Comment({
  comment,
  review,
  className,
}: {
  comment: ReviewComment;
  review: ReviewContext;
  className?: string;
}) {
  const pending = review.pendingIds.has(comment._id);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await review.onDelete(comment);
    setDeleting(false);
    setConfirming(false);
  }

  return (
    <div className={cn("space-y-1.5 p-3", comment.isOwner && "bg-muted/40", className)}>
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <AuthorName author={comment.author} className="font-medium" />
        {comment.isOwner && (
          <Badge variant="secondary" className="rounded-full">
            Author
          </Badge>
        )}
        <time dateTime={comment._createdAt} className="text-xs text-muted-foreground">
          {dateFormat.format(new Date(comment._createdAt))}
        </time>
        {pending ? (
          <Badge variant="outline" className="rounded-full text-muted-foreground">
            <Clock /> Waiting for approval
          </Badge>
        ) : (
          !comment.parentId && <StatusBadge comment={comment} repoUrl={review.repoUrl} />
        )}
      </div>
      <p className="text-pretty whitespace-pre-line">{comment.body}</p>
      {!comment.parentId && comment.statusNote && comment.status !== "open" && (
        <p className="border-l-2 pl-2 text-muted-foreground">{comment.statusNote}</p>
      )}
      {review.canDelete(comment) &&
        (confirming ? (
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs text-muted-foreground">
              {comment.parentId ? "Delete this reply?" : "Delete this comment and its replies?"}
            </span>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-full"
              onClick={handleDelete}
              disabled={deleting}
            >
              <Trash2 />
              {deleting ? "Deleting…" : "Delete"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => setConfirming(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="pt-1">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
              onClick={() => setConfirming(true)}
            >
              <Trash2 /> Delete
            </Button>
          </div>
        ))}
    </div>
  );
}

function AuthorName({
  author,
  className,
}: {
  author: ReviewComment["author"];
  className?: string;
}) {
  return author.url ? (
    <a
      href={author.url}
      target="_blank"
      rel="nofollow ugc noreferrer"
      className={cn("hover:underline", className)}
    >
      {author.name}
    </a>
  ) : (
    <span className={className}>{author.name}</span>
  );
}

function StatusBadge({ comment, repoUrl }: { comment: ReviewComment; repoUrl: string | null }) {
  if (comment.status === "fixed") {
    const sha = comment.fixedInCommit;
    const label = sha ? `Fixed in ${shortSha(sha)}` : "Fixed";
    const linked = Boolean(sha && repoUrl);
    return (
      <Badge
        variant="outline"
        className="rounded-full border-success/40 text-success"
        asChild={linked}
      >
        {linked ? (
          <a href={`${repoUrl}/commit/${sha}`} target="_blank" rel="noreferrer">
            {label}
          </a>
        ) : (
          label
        )}
      </Badge>
    );
  }
  if (comment.status === "wontfix") {
    return (
      <Badge variant="outline" className="rounded-full">
        Won&apos;t fix
      </Badge>
    );
  }
  if (comment.status === "til") {
    return (
      <Badge variant="outline" className="rounded-full">
        Good point, TIL
      </Badge>
    );
  }
  return null;
}
