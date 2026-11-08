"use client";

import { createStudioConfig } from "@portfolio/sanity";

import { apiVersion, dataset, projectId } from "@/lib/sanity/env";

export default createStudioConfig({ projectId, dataset, apiVersion, basePath: "/studio" });
