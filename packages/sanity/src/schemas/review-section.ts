import { CodeIcon } from "@sanity/icons/Code";
import { defineField, defineType } from "sanity";
import { DEFAULT_API_VERSION } from "@portfolio/content/client";
import { REVIEW_SECTIONS } from "@portfolio/content/types";

import { UniqueSectionInput } from "../components/unique-section-input";

const sectionTitle = (value?: string) =>
  REVIEW_SECTIONS.find((s) => s.value === value)?.title ?? value ?? "Untitled section";

export const reviewSection = defineType({
  name: "reviewSection",
  title: "Review section",
  type: "document",
  icon: CodeIcon,
  fields: [
    defineField({
      name: "section",
      description:
        "The part of the site whose source code visitors can review. Sections that already have review settings aren't listed.",
      type: "string",
      options: { list: REVIEW_SECTIONS.map((s) => ({ ...s })) },
      components: { input: UniqueSectionInput },
      validation: (rule) =>
        rule.required().custom(async (value, { document, getClient }) => {
          if (!value || !document) return true;
          const id = document._id.replace(/^drafts\./, "");
          const duplicates = await getClient({ apiVersion: DEFAULT_API_VERSION }).fetch<number>(
            `count(*[_type == "reviewSection" && section == $value && !(_id in [$id, $draft])])`,
            { value, id, draft: `drafts.${id}` },
          );
          return duplicates === 0 ? true : "This section already has its own review settings.";
        }),
    }),
    defineField({
      name: "enabled",
      title: "Open for review",
      description: "Shows the “Review this code” button on this section.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "prompt",
      title: "What I'd like feedback on",
      description: "Shown at the top of the review panel.",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "pinnedComment",
      title: "Pinned comment",
      description: "Highlight one thread, e.g. the hardest feedback you got.",
      type: "reference",
      to: [{ type: "reviewComment" }],
      options: {
        filter: ({ document }) => ({
          filter: "section == $section && !defined(parent)",
          params: { section: (document as { section?: string }).section ?? "" },
        }),
      },
    }),
  ],
  preview: {
    select: { section: "section", enabled: "enabled" },
    prepare: ({ section, enabled }) => ({
      title: sectionTitle(section),
      subtitle: enabled ? "Open for review" : "Closed",
    }),
  },
});
