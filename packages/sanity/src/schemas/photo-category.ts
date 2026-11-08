import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

export const photoCategory = defineType({
  name: "photoCategory",
  title: "Photo category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      description: "Lower numbers come first in the photo filter.",
      type: "number",
    }),
  ],
  orderings: [
    {
      title: "Manual order",
      name: "sortOrderAsc",
      by: [
        { field: "sortOrder", direction: "asc" },
        { field: "title", direction: "asc" },
      ],
    },
  ],
  preview: { select: { title: "title", subtitle: "slug.current" } },
});
