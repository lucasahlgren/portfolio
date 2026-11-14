import { createHash, timingSafeEqual } from "node:crypto";

import { isReviewSection } from "@/lib/review/sources";
import { reviewWriteClient } from "@/lib/sanity/write-client";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

const fail = (message: string, status: number) => Response.json({ message }, { status });

function matches(token: string, expectedHash: string | undefined) {
  if (!expectedHash) return false;
  const actual = Buffer.from(createHash("sha256").update(token).digest("hex"));
  const expected = Buffer.from(expectedHash);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function DELETE(
  request: Request,
  { params }: RouteContext<"/api/review/[section]/comments/[id]">,
) {
  const { section, id } = await params;
  if (!isReviewSection(section) || !UUID.test(id)) return fail("This comment doesn't exist.", 404);
  if (!reviewWriteClient)
    return fail("Comments can't be deleted right now. Please try again later.", 503);

  const body = (await request.json().catch(() => null)) as { token?: unknown } | null;
  const token = typeof body?.token === "string" ? body.token : "";
  if (!token) return fail("You can only delete comments you wrote.", 403);

  const versions = await reviewWriteClient.fetch<{ _id: string; deleteTokenHash?: string }[]>(
    `*[_type == "reviewComment" && _id in [$id, $draft] && section == $section]{ _id, deleteTokenHash }`,
    { id, draft: `drafts.${id}`, section },
  );
  if (versions.length === 0) return Response.json({ deleted: true });
  if (!versions.every((version) => matches(token, version.deleteTokenHash))) {
    return fail("You can only delete comments you wrote.", 403);
  }

  const [replies, pinnedBy] = await Promise.all([
    reviewWriteClient.fetch<string[]>(`*[_type == "reviewComment" && parent._ref == $id]._id`, {
      id,
    }),
    reviewWriteClient.fetch<string[]>(
      `*[_type == "reviewSection" && pinnedComment._ref == $id]._id`,
      { id },
    ),
  ]);

  const transaction = reviewWriteClient.transaction();
  for (const sectionId of pinnedBy) {
    transaction.patch(sectionId, (patch) => patch.unset(["pinnedComment"]));
  }
  for (const documentId of [...versions.map((version) => version._id), ...replies]) {
    transaction.delete(documentId);
  }
  await transaction.commit();

  return Response.json({ deleted: true });
}
