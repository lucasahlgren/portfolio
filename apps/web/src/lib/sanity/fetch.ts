import { createClient, type QueryParams } from "next-sanity";
import { cacheLife, cacheTag } from "next/cache";

import { apiVersion, dataset, isSanityConfigured, projectId } from "./env";

const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      perspective: "published",
    })
  : null;

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T | null> {
  "use cache";
  cacheTag(...tags);
  if (process.env.NODE_ENV === "development") cacheLife({ stale: 300, revalidate: 1, expire: 300 });
  else cacheLife("hours");

  if (!client) return null;
  return client.fetch<T>(query, params);
}
