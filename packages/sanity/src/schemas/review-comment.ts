import { CommentIcon } from "@sanity/icons/Comment";
import { defineField, defineType } from "sanity";
import { REVIEW_SECTIONS, REVIEW_STATUSES } from "@portfolio/content/types";

type CommentDocument = { parent?: unknown; status?: string };

export const reviewComment = defineType({
  name: "reviewComment",
  title: "Review comment",
  type: "document",
  icon: CommentIcon,
  groups: [
    { name: "comment", title: "Comment", default: true },
    { name: "anchor", title: "Code location" },
    { name: "status", title: "Status" },
  ],
  fields: [
    defineField({
      name: "author",
      type: "object",
      group: "comment",
      readOnly: ({ document }) => Boolean(document?.isOwner),
      fields: [
        defineField({
          name: "name",
          type: "string",
          validation: (rule) => rule.required().max(60),
        }),
        defineField({
          name: "url",
          title: "Link",
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["https"] }),
        }),
      ],
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 5,
      group: "comment",
      validation: (rule) => rule.required().max(2000),
    }),
    defineField({
      name: "parent",
      title: "Reply to",
      type: "reference",
      group: "comment",
      to: [{ type: "reviewComment" }],
      weak: true,
      readOnly: true,
    }),
    defineField({
      name: "isOwner",
      title: "Written by me",
      type: "boolean",
      group: "comment",
      initialValue: false,
      readOnly: true,
    }),
    defineField({
      name: "section",
      type: "string",
      group: "anchor",
      options: { list: REVIEW_SECTIONS.map((s) => ({ ...s })) },
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "filePath", type: "string", group: "anchor", readOnly: true }),
    defineField({ name: "line", type: "number", group: "anchor", readOnly: true }),
    defineField({
      name: "commitSha",
      title: "Commit",
      type: "string",
      group: "anchor",
      readOnly: true,
    }),
    defineField({
      name: "lineText",
      title: "Line content",
      type: "string",
      group: "anchor",
      readOnly: true,
    }),
    defineField({
      name: "context",
      title: "Surrounding code",
      type: "text",
      rows: 3,
      group: "anchor",
      readOnly: true,
    }),
    defineField({
      name: "status",
      type: "string",
      group: "status",
      options: { list: REVIEW_STATUSES.map((s) => ({ ...s })), layout: "radio" },
      initialValue: "open",
      hidden: ({ document }) => Boolean((document as CommentDocument | undefined)?.parent),
    }),
    defineField({
      name: "fixedInCommit",
      title: "Fixed in commit",
      description: "The commit SHA that addressed this comment.",
      type: "string",
      group: "status",
      hidden: ({ document }) => (document as CommentDocument | undefined)?.status !== "fixed",
      validation: (rule) =>
        rule
          .regex(/^[0-9a-f]{7,40}$/, { name: "commit SHA" })
          .error("Use a 7–40 character commit SHA."),
    }),
    defineField({
      name: "statusNote",
      title: "Status note",
      description: "Why it won't be fixed, or what you learned.",
      type: "text",
      rows: 3,
      group: "status",
      hidden: ({ document }) => {
        const doc = document as CommentDocument | undefined;
        return Boolean(doc?.parent) || !doc?.status || doc.status === "open";
      },
    }),
    defineField({
      name: "submitterHash",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
    defineField({
      name: "deleteTokenHash",
      type: "string",
      hidden: true,
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      name: "author.name",
      isOwner: "isOwner",
      body: "body",
      section: "section",
      filePath: "filePath",
      line: "line",
    },
    prepare: ({ name, isOwner, body, section, filePath, line }) => {
      const file = filePath?.split("/").pop();
      const location = [file && line ? `${file}:${line}` : file, section]
        .filter(Boolean)
        .join(" · ");
      return {
        title: `${isOwner ? "You" : (name ?? "Anonymous")}: ${body ?? ""}`,
        subtitle: location,
      };
    },
  },
});
