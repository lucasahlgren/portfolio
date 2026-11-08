import { education } from "./education";
import { job } from "./job";
import { photo } from "./photo";
import { photoCategory } from "./photo-category";
import { project } from "./project";
import { settings } from "./settings";

export const schemaTypes = [settings, project, job, education, photo, photoCategory];

export const singletonTypes = new Set(["settings"]);
