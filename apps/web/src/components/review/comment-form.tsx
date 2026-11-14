"use client";

import type { ReviewComment, ReviewSectionKey } from "@portfolio/content";
import { useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { readAuthor, saveAuthor, saveOwned, savePending } from "@/lib/review/browser";
import { REVIEW_LIMITS } from "@/lib/review/limits";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2 font-sans text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

export function CommentForm({
  section,
  filePath,
  line,
  parentId,
  onCancel,
  onPosted,
  className,
}: {
  section: ReviewSectionKey;
  filePath: string;
  line: number;
  parentId?: string;
  onCancel: () => void;
  onPosted: (comment: ReviewComment) => void;
  className?: string;
}) {
  const [author] = useState(readAuthor);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startedAt = useRef(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const url = String(form.get("url") ?? "").trim();

    setSending(true);
    setError(null);
    try {
      const response = await fetch(`/api/review/${section}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          url,
          body: form.get("body"),
          website: form.get("website"),
          filePath,
          line,
          parentId,
          startedAt: startedAt.current,
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        comment?: ReviewComment | null;
        deleteToken?: string;
        message?: string;
      };

      if (!response.ok) {
        setError(result.message ?? "Your comment couldn't be sent. Please try again.");
        return;
      }

      saveAuthor({ name, url });
      if (result.comment) {
        savePending(result.comment);
        if (result.deleteToken) saveOwned(result.comment._id, result.deleteToken);
        onPosted(result.comment);
      } else {
        onCancel();
      }
      toast.success("Thanks for the review!", {
        description: "Your comment will appear for everyone once it's approved.",
      });
    } catch {
      setError("Your comment couldn't be sent. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onFocusCapture={() => {
        if (!startedAt.current) startedAt.current = Date.now();
      }}
      className={cn("space-y-3 rounded-lg border bg-card p-3 font-sans text-sm", className)}
    >
      <p className="font-mono text-xs text-muted-foreground">
        {parentId ? "Reply to this thread" : `Comment on ${filePath.split("/").pop()}:${line}`}
      </p>
      <textarea
        name="body"
        required
        rows={4}
        maxLength={REVIEW_LIMITS.bodyMax}
        aria-label="Comment"
        placeholder={parentId ? "Write a reply…" : "What would you do differently?"}
        autoFocus
        className={cn(fieldClass, "resize-y leading-relaxed")}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Name</span>
          <input
            name="name"
            required
            maxLength={REVIEW_LIMITS.nameMax}
            autoComplete="name"
            defaultValue={author.name}
            className={fieldClass}
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-muted-foreground">Link (optional)</span>
          <input
            name="url"
            type="url"
            maxLength={REVIEW_LIMITS.urlMax}
            placeholder="https://github.com/you"
            autoComplete="url"
            defaultValue={author.url}
            className={fieldClass}
          />
        </label>
      </div>
      <div aria-hidden="true" className="sr-only">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Your name and link are shown with your comment once it&apos;s approved.
        </p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={sending}>
            Cancel
          </Button>
          <Button type="submit" disabled={sending}>
            {sending ? "Sending…" : parentId ? "Reply" : "Comment"}
          </Button>
        </div>
      </div>
    </form>
  );
}
