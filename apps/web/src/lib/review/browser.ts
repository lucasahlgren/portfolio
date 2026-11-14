import type { ReviewComment, ReviewSectionKey } from "@portfolio/content";

const PENDING_KEY = "review:pending";
const AUTHOR_KEY = "review:author";
const PENDING_MAX_AGE = 1000 * 60 * 60 * 24 * 30;

type StoredPending = { comment: ReviewComment; savedAt: number };

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export function readPending(section: ReviewSectionKey, publishedIds: Set<string>) {
  const now = Date.now();
  const stored = read<StoredPending[]>(PENDING_KEY, []).filter(
    (entry) => now - entry.savedAt < PENDING_MAX_AGE && !publishedIds.has(entry.comment._id),
  );
  write(PENDING_KEY, stored);
  return stored.filter((entry) => entry.comment.section === section).map((entry) => entry.comment);
}

export function savePending(comment: ReviewComment) {
  write(PENDING_KEY, [...read<StoredPending[]>(PENDING_KEY, []), { comment, savedAt: Date.now() }]);
}

export function forgetPending(ids: string[]) {
  const forget = new Set(ids);
  write(
    PENDING_KEY,
    read<StoredPending[]>(PENDING_KEY, []).filter((entry) => !forget.has(entry.comment._id)),
  );
}

const OWNED_KEY = "review:owned";

export const readOwned = () => read<Record<string, string>>(OWNED_KEY, {});

export function saveOwned(id: string, token: string) {
  write(OWNED_KEY, { ...readOwned(), [id]: token });
}

export function forgetOwned(id: string) {
  const owned = readOwned();
  delete owned[id];
  write(OWNED_KEY, owned);
}

export type SavedAuthor = { name: string; url: string };

export const readAuthor = () => read<SavedAuthor>(AUTHOR_KEY, { name: "", url: "" });

export const saveAuthor = (author: SavedAuthor) => write(AUTHOR_KEY, author);

export type ReviewTarget = { section: string; file: string | null; line: number | null };

export function parseReviewHash(hash: string): ReviewTarget | null {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  const section = params.get("review");
  if (!section) return null;
  const line = Number(params.get("line"));
  return {
    section,
    file: params.get("file"),
    line: Number.isInteger(line) && line > 0 ? line : null,
  };
}

export function reviewLink(section: ReviewSectionKey, file: string, line: number) {
  const params = new URLSearchParams({ review: section, file, line: String(line) });
  return `${window.location.origin}${window.location.pathname}#${params.toString()}`;
}

export function subscribeToHash(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}

export function clearReviewHash() {
  window.history.replaceState(null, "", window.location.pathname + window.location.search);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}
