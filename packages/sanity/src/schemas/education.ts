import { BookIcon } from "@sanity/icons/Book";
import { defineField, defineType } from "sanity";

export const education = defineType({
  name: "education",
  title: "Education",
  type: "document",
  icon: BookIcon,
  fields: [
    defineField({ name: "school", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "degree",
      title: "Programme / course",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "startYear",
      type: "number",
      validation: (rule) => rule.required().integer(),
    }),
    defineField({
      name: "endYear",
      description: "Leave empty if ongoing.",
      type: "number",
      validation: (rule) => rule.integer(),
    }),
    defineField({ name: "description", type: "text", rows: 3 }),
    defineField({
      name: "logo",
      type: "image",
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
  ],
  orderings: [
    { title: "Newest first", name: "startDesc", by: [{ field: "startYear", direction: "desc" }] },
  ],
  preview: {
    select: { title: "school", subtitle: "degree", media: "logo" },
  },
});
