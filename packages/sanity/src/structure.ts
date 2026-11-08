import { BookIcon } from "@sanity/icons/Book";
import { CaseIcon } from "@sanity/icons/Case";
import { CogIcon } from "@sanity/icons/Cog";
import { ImageIcon } from "@sanity/icons/Image";
import { ProjectsIcon } from "@sanity/icons/Projects";
import { TagIcon } from "@sanity/icons/Tag";
import type { StructureResolver } from "sanity/structure";

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
    ]);
