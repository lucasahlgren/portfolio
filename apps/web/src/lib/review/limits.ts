export const REVIEW_LIMITS = {
  nameMax: 60,
  urlMax: 200,
  bodyMax: 2000,
  linksMax: 2,
  pendingMax: 5,
  minFillMs: 3000,
} as const;

export type CommentInput = {
  name: string;
  url: string | null;
  body: string;
  filePath: string;
  line: number;
  parentId: string | null;
  website: string;
  startedAt: number;
};

type ParseResult = { ok: true; input: CommentInput } | { ok: false; message: string };

const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");

export function parseCommentInput(value: unknown): ParseResult {
  if (!value || typeof value !== "object") {
    return { ok: false, message: "Your comment couldn't be read. Please try again." };
  }
  const data = value as Record<string, unknown>;

  const name = text(data.name);
  if (!name) return { ok: false, message: "Please add your name." };
  if (name.length > REVIEW_LIMITS.nameMax) {
    return {
      ok: false,
      message: `Please keep your name under ${REVIEW_LIMITS.nameMax} characters.`,
    };
  }

  const url = text(data.url) || null;
  if (url && (url.length > REVIEW_LIMITS.urlMax || !isHttpsUrl(url))) {
    return { ok: false, message: "The link needs to be a full https:// address." };
  }

  const body = text(data.body);
  if (!body) return { ok: false, message: "Please write a comment." };
  if (body.length > REVIEW_LIMITS.bodyMax) {
    return {
      ok: false,
      message: `Please keep your comment under ${REVIEW_LIMITS.bodyMax} characters.`,
    };
  }
  if ((body.match(/https?:\/\//g) ?? []).length > REVIEW_LIMITS.linksMax) {
    return {
      ok: false,
      message: `Please include at most ${REVIEW_LIMITS.linksMax} links in your comment.`,
    };
  }

  const line = Number(data.line);
  const startedAt = Number(data.startedAt);

  return {
    ok: true,
    input: {
      name,
      url,
      body,
      filePath: text(data.filePath),
      line: Number.isInteger(line) ? line : 0,
      parentId: text(data.parentId) || null,
      website: text(data.website),
      startedAt: Number.isFinite(startedAt) ? startedAt : 0,
    },
  };
}

function isHttpsUrl(value: string) {
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}
