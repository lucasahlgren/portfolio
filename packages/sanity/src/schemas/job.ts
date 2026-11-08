import { CaseIcon } from "@sanity/icons/Case";
import { defineArrayMember, defineField, defineType } from "sanity";
import { EMPLOYMENT_TYPES } from "@portfolio/content/types";

export const job = defineType({
  name: "job",
  title: "Job",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({ name: "role", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "company", type: "string", validation: (rule) => rule.required() }),
    defineField({ name: "url", title: "Company website", type: "url" }),
    defineField({ name: "location", type: "string" }),
    defineField({
      name: "employmentType",
      type: "string",
      options: { list: EMPLOYMENT_TYPES.map((t) => ({ ...t })) },
    }),
    defineField({
      name: "startDate",
      type: "date",
      options: { dateFormat: "YYYY-MM" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "endDate",
      description: "Leave empty if this is your current position.",
      type: "date",
      options: { dateFormat: "YYYY-MM" },
      validation: (rule) =>
        rule.custom((end, ctx) => {
          const start = (ctx.document as { startDate?: string } | undefined)?.startDate;
          return !end || !start || end >= start ? true : "End date must be after start date";
        }),
    }),
    defineField({ name: "summary", type: "text", rows: 3 }),
    defineField({
      name: "highlights",
      description: "Key achievements, one per entry.",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "tools",
      title: "Tools & technologies",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "logo",
      type: "image",
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
  ],
  orderings: [
    {
      title: "Start date, newest",
      name: "startDesc",
      by: [{ field: "startDate", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "role",
      company: "company",
      start: "startDate",
      end: "endDate",
      media: "logo",
    },
    prepare: ({ title, company, start, end, media }) => ({
      title,
      subtitle: `${company} · ${start?.slice(0, 4) ?? "?"}–${end?.slice(0, 4) ?? "now"}`,
      media,
    }),
  },
});
