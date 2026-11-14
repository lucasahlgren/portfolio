import {
  educationQuery,
  homeQuery,
  jobsQuery,
  photosQuery,
  projectQuery,
  projectSlugsQuery,
  projectsQuery,
  reviewCommentsQuery,
  reviewConfigQuery,
  settingsQuery,
  type Education,
  type HomeData,
  type Job,
  type Photo,
  type Project,
  type ProjectCard,
  type ReviewComment,
  type ReviewConfig,
  type ReviewSectionKey,
  type Settings,
} from "@portfolio/content";

import { sanityFetch } from "./fetch";

export const getSettings = () =>
  sanityFetch<Settings>({ query: settingsQuery, tags: ["settings"] });

export const getHome = async (): Promise<HomeData> =>
  (await sanityFetch<HomeData>({
    query: homeQuery,
    tags: ["settings", "project", "job", "photo"],
  })) ?? { settings: null, projects: [], jobs: [], photos: [] };

export const getProjects = async () =>
  (await sanityFetch<ProjectCard[]>({ query: projectsQuery, tags: ["project"] })) ?? [];

export const getProject = (slug: string) =>
  sanityFetch<Project>({ query: projectQuery, params: { slug }, tags: ["project"] });

export const getProjectSlugs = async () =>
  (await sanityFetch<string[]>({ query: projectSlugsQuery, tags: ["project"] })) ?? [];

export const getJobs = async () =>
  (await sanityFetch<Job[]>({ query: jobsQuery, tags: ["job"] })) ?? [];

export const getEducation = async () =>
  (await sanityFetch<Education[]>({ query: educationQuery, tags: ["education"] })) ?? [];

export const getPhotos = async () =>
  (await sanityFetch<Photo[]>({ query: photosQuery, tags: ["photo", "photoCategory"] })) ?? [];

export const getReviewConfig = async (): Promise<ReviewConfig> =>
  (await sanityFetch<ReviewConfig>({
    query: reviewConfigQuery,
    tags: ["settings", "reviewSection", "reviewComment"],
  })) ?? { enabled: false, intro: null, sections: [] };

export const getReviewComments = async (section: ReviewSectionKey) =>
  (await sanityFetch<ReviewComment[]>({
    query: reviewCommentsQuery,
    params: { section },
    tags: ["reviewComment"],
  })) ?? [];
