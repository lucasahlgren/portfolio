import { ImageIcon } from "@sanity/icons/Image";
import { defineField, defineType } from "sanity";

export const photo = defineType({
  name: "photo",
  title: "Photo",
  type: "document",
  icon: ImageIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true, metadata: ["lqip", "palette", "exif"] },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
      validation: (rule) => rule.required(),
    }),
    defineField({ name: "takenAt", title: "Date taken", type: "date" }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "category",
      type: "reference",
      to: [{ type: "photoCategory" }],
    }),
  ],
  orderings: [
    { title: "Newest first", name: "takenAtDesc", by: [{ field: "takenAt", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", category: "category.title", date: "takenAt", media: "image" },
    prepare: ({ title, category, date, media }) => ({
      title,
      subtitle: [category, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});
