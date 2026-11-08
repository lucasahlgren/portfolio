import { ProjectsIcon } from "@sanity/icons/Projects";
import { defineArrayMember, defineField, defineType } from "sanity";
import { PROJECT_CATEGORIES, PROJECT_KINDS } from "@portfolio/content/types";

const imageWithAlt = (name: string, title?: string) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        validation: (rule) => rule.warning().required(),
      }),
    ],
  });

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  icon: ProjectsIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "media", title: "Media" },
    { name: "meta", title: "Details" },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "content",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      description: "Short tagline shown on cards.",
      type: "string",
      group: "content",
    }),
    defineField({
      name: "excerpt",
      description: "One-paragraph summary used for SEO and the project intro.",
      type: "text",
      rows: 3,
      group: "content",
    }),
    defineField({
      name: "body",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alternative text", type: "string" }),
            defineField({ name: "caption", type: "string" }),
          ],
        }),
      ],
    }),
    { ...imageWithAlt("coverImage", "Cover image"), group: "media" },
    defineField({
      name: "videoUrl",
      title: "Video URL",
      description: "YouTube or Vimeo link. Shown instead of the cover on the project page.",
      type: "url",
      group: "media",
    }),
    defineField({
      name: "gallery",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
        }),
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "kind",
      title: "Type",
      type: "string",
      group: "meta",
      options: { list: PROJECT_KINDS.map((k) => ({ ...k })), layout: "radio" },
      initialValue: "school",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      type: "string",
      group: "meta",
      options: { list: PROJECT_CATEGORIES.map((c) => ({ ...c })), layout: "radio" },
    }),
    defineField({
      name: "year",
      type: "number",
      group: "meta",
      validation: (rule) => rule.integer().min(2000).max(2100),
    }),
    defineField({
      name: "role",
      title: "My role",
      type: "string",
      group: "meta",
    }),
    defineField({
      name: "team",
      description: "Collaborators, one per entry.",
      type: "array",
      group: "meta",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "tools",
      title: "Tools & technologies",
      type: "array",
      group: "meta",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "links",
      type: "array",
      group: "meta",
      of: [
        defineArrayMember({
          type: "object",
          name: "projectLink",
          fields: [
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "accentColor",
      title: "Accent colour",
      description: "Hex colour (e.g. #FF5A1F) used for small highlights on this project.",
      type: "string",
      group: "meta",
      validation: (rule) =>
        rule.regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, { name: "hex colour" }).warning(),
    }),
    defineField({
      name: "featured",
      description: "Show on the home page (up to four).",
      type: "boolean",
      group: "meta",
      initialValue: false,
    }),
    defineField({
      name: "sortOrder",
      description: "Lower numbers come first. Leave empty to sort by year.",
      type: "number",
      group: "meta",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "sortOrderAsc",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "year", direction: "desc" },
      ],
    },
    { title: "Year, newest", name: "yearDesc", by: [{ field: "year", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", year: "year", subtitle: "subtitle", media: "coverImage" },
    prepare: ({ title, year, subtitle, media }) => ({
      title,
      subtitle: [year, subtitle].filter(Boolean).join(" · "),
      media,
    }),
  },
});
