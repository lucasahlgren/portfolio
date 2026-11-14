import { reviewWriteClient } from "@/lib/sanity/write-client";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

export async function GET(request: Request) {
  const ids = (new URL(request.url).searchParams.get("ids") ?? "")
    .split(",")
    .filter((id) => UUID.test(id))
    .slice(0, 20);

  if (!reviewWriteClient || ids.length === 0) return Response.json({ waiting: null });

  const existing = await reviewWriteClient.fetch<string[]>(
    `*[_type == "reviewComment" && (_id in $ids || _id in $drafts)]._id`,
    { ids, drafts: ids.map((id) => `drafts.${id}`) },
  );

  return Response.json({
    waiting: [...new Set(existing.map((id) => id.replace(/^drafts\./, "")))],
  });
}
