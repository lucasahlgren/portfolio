export function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    if (host.endsWith("youtube.com")) {
      const id = u.searchParams.get("v") ?? u.pathname.split("/").pop();
      return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
    }
    if (host.endsWith("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean).pop();
      return id ? `https://player.vimeo.com/video/${id}?dnt=1` : null;
    }
  } catch {
    return null;
  }
  return null;
}

export function VideoEmbed({ url, title }: { url: string; title: string }) {
  const src = toEmbedUrl(url);
  if (!src) return null;
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        className="absolute inset-0 size-full"
      />
    </div>
  );
}
