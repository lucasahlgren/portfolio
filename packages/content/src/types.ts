import type { PortableTextBlock } from "@portabletext/types";

export type { PortableTextBlock };

export type SanityImage = {
  _type: "image";
  asset?: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  crop?: { top: number; bottom: number; left: number; right: number };
  alt: string;
  lqip?: string | null;
  dimensions?: { width: number; height: number; aspectRatio: number } | null;
};

export const SOCIAL_PLATFORMS = [
  "linkedin",
  "github",
  "instagram",
  "x",
  "dribbble",
  "youtube",
  "500px",
  "other",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export type SocialLink = { _key: string; platform: SocialPlatform; url: string };

export type Settings = {
  name: string;
  role: string | null;
  headline: string | null;
  intro: string | null;
  location: string | null;
  email: string | null;
  availableForWork: boolean | null;
  portrait: SanityImage | null;
  socials: SocialLink[] | null;
  skills: string[] | null;
  bio: PortableTextBlock[] | null;
  seo: { title: string | null; description: string | null; ogImage: SanityImage | null } | null;
};

export const PROJECT_KINDS = [
  { title: "School project", value: "school" },
  { title: "Spare time project", value: "personal" },
] as const;
export type ProjectKind = (typeof PROJECT_KINDS)[number]["value"];

export const PROJECT_CATEGORIES = [
  { title: "Web", value: "web" },
  { title: "Mobile", value: "mobile" },
  { title: "Data visualization", value: "dataviz" },
  { title: "Design", value: "design" },
  { title: "Motion & video", value: "motion" },
  { title: "Game", value: "game" },
  { title: "AR / XR", value: "xr" },
  { title: "Research", value: "research" },
] as const;
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]["value"];

export type ProjectCard = {
  _id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  kind: ProjectKind;
  category: ProjectCategory | null;
  year: number | null;
  featured: boolean | null;
  accentColor: string | null;
  coverImage: SanityImage | null;
};

export type Project = ProjectCard & {
  excerpt: string | null;
  role: string | null;
  team: string[] | null;
  body: PortableTextBlock[] | null;
  videoUrl: string | null;
  gallery: SanityImage[] | null;
  tools: string[] | null;
  links: { _key: string; label: string; url: string }[] | null;
};

export const EMPLOYMENT_TYPES = [
  { title: "Full-time", value: "full-time" },
  { title: "Part-time", value: "part-time" },
  { title: "Contract", value: "contract" },
  { title: "Freelance", value: "freelance" },
  { title: "Internship", value: "internship" },
] as const;
export type EmploymentType = (typeof EMPLOYMENT_TYPES)[number]["value"];

export type Job = {
  _id: string;
  company: string;
  role: string;
  location: string | null;
  employmentType: EmploymentType | null;
  startDate: string;
  endDate: string | null;
  url: string | null;
  summary: string | null;
  highlights: string[] | null;
  tools: string[] | null;
  logo: SanityImage | null;
};

export type Education = {
  _id: string;
  school: string;
  degree: string;
  location: string | null;
  startYear: number;
  endYear: number | null;
  description: string | null;
  logo: SanityImage | null;
};

export type PhotoCategory = { title: string; slug: string; order: number };

export type Photo = {
  _id: string;
  title: string;
  takenAt: string | null;
  location?: string | null;
  category?: PhotoCategory | null;
  image: SanityImage;
};

export type HomeData = {
  settings: Settings | null;
  projects: ProjectCard[];
  jobs: Job[];
  photos: Photo[];
};
