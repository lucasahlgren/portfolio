import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import {
  ApproveCommentAction,
  RejectCommentAction,
  ReplyCommentAction,
} from "./actions/review-actions";
import { schemaTypes, singletonTypes, visitorCreatedTypes } from "./schemas/index";
import { structure } from "./structure";

export { schemaTypes, singletonTypes, structure };

export type StudioOptions = {
  projectId: string;
  dataset: string;
  apiVersion: string;
  basePath?: string;
};

export function createStudioConfig({
  projectId,
  dataset,
  apiVersion,
  basePath = "/studio",
}: StudioOptions) {
  return defineConfig({
    name: "portfolio",
    title: "Lucas Ahlgren — Portfolio",
    projectId,
    dataset,
    basePath,
    plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
    schema: {
      types: schemaTypes,
      templates: (templates) =>
        templates.filter(
          ({ schemaType }) =>
            !singletonTypes.has(schemaType) && !visitorCreatedTypes.has(schemaType),
        ),
    },
    document: {
      actions: (input, context) => {
        if (singletonTypes.has(context.schemaType)) {
          return input.filter(
            ({ action }) => action && ["publish", "discardChanges", "restore"].includes(action),
          );
        }
        if (context.schemaType === "reviewSection") {
          return input.filter(({ action }) => action !== "duplicate");
        }
        if (context.schemaType === "reviewComment") {
          return [
            ApproveCommentAction,
            RejectCommentAction,
            ReplyCommentAction,
            ...input.filter(({ action }) => action !== "publish" && action !== "duplicate"),
          ];
        }
        return input;
      },
    },
  });
}
