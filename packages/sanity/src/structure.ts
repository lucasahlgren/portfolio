import { BookIcon } from "@sanity/icons/Book";
import { CaseIcon } from "@sanity/icons/Case";
import { CheckmarkCircleIcon } from "@sanity/icons/CheckmarkCircle";
import { ClockIcon } from "@sanity/icons/Clock";
import { CodeIcon } from "@sanity/icons/Code";
import { CogIcon } from "@sanity/icons/Cog";
import { ImageIcon } from "@sanity/icons/Image";
import { ProjectsIcon } from "@sanity/icons/Projects";
import { TagIcon } from "@sanity/icons/Tag";
import type { StructureBuilder, StructureResolver } from "sanity/structure";

const commentList = (S: StructureBuilder, title: string, filter: string) =>
  S.documentList()
    .title(title)
    .schemaType("reviewComment")
    .filter(filter)
    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
    .initialValueTemplates([]);

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Portfolio")
    .items([
      S.listItem()
        .title("Profile & settings")
        .id("settings")
        .icon(CogIcon)
        .child(S.document().schemaType("settings").documentId("settings")),
      S.divider(),
      S.documentTypeListItem("project").title("Projects").icon(ProjectsIcon),
      S.documentTypeListItem("job").title("Jobs").icon(CaseIcon),
      S.documentTypeListItem("education").title("Education").icon(BookIcon),
      S.documentTypeListItem("photo").title("Photography").icon(ImageIcon),
      S.documentTypeListItem("photoCategory").title("Photo categories").icon(TagIcon),
      S.divider(),
      S.listItem()
        .title("Code review")
        .id("codeReview")
        .icon(CodeIcon)
        .child(
          S.list()
            .title("Code review")
            .items([
              S.documentTypeListItem("reviewSection").title("Sections").icon(CodeIcon),
              S.listItem()
                .title("Waiting for approval")
                .id("reviewPending")
                .icon(ClockIcon)
                .child(
                  commentList(
                    S,
                    "Waiting for approval",
                    `_type == "reviewComment" && _id in path("drafts.**")`,
                  ),
                ),
              S.listItem()
                .title("Published comments")
                .id("reviewPublished")
                .icon(CheckmarkCircleIcon)
                .child(
                  commentList(
                    S,
                    "Published comments",
                    `_type == "reviewComment" && !(_id in path("drafts.**"))`,
                  ),
                ),
            ]),
        ),
    ]);
