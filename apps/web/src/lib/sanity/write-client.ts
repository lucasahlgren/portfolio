import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "./env";

const token = process.env.SANITY_REVIEW_WRITE_TOKEN;

export const reviewHashSalt = process.env.REVIEW_HASH_SALT ?? "";

export const reviewWriteClient =
  projectId && token && reviewHashSalt
    ? createClient({ projectId, dataset, apiVersion, token, useCdn: false, perspective: "raw" })
    : null;
