import { education } from "./education";
import { job } from "./job";
import { photo } from "./photo";
import { photoCategory } from "./photo-category";
import { project } from "./project";
import { reviewComment } from "./review-comment";
import { reviewSection } from "./review-section";
import { settings } from "./settings";

export const schemaTypes = [
  settings,
  project,
  job,
  education,
  photo,
  photoCategory,
  reviewSection,
  reviewComment,
];

export const visitorCreatedTypes = new Set(["reviewComment"]);

export const singletonTypes = new Set(["settings"]);
