import { CogIcon } from "@sanity/icons/Cog";
import { defineArrayMember, defineField, defineType } from "sanity";
import { SOCIAL_PLATFORMS } from "@portfolio/content/types";

export const settings = defineType({
  name: "settings",
  title: "Profile & settings",
  type: "document",
  icon: CogIcon,
  groups: [
    { name: "profile", title: "Profile", default: true },
    { name: "home", title: "Home page" },
    { name: "about", title: "About" },
    { name: "contact", title: "Contact" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "name",
      type: "string",
      group: "profile",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / title",
      description: 'Short title shown next to your name, e.g. "Media engineer".',
      type: "string",
      group: "profile",
    }),
    defineField({
      name: "headline",
      description:
        "The big statement on the home page. Wrap words in *asterisks* to set them in italic serif.",
      type: "text",
      rows: 2,
      group: "profile",
    }),
    defineField({
      name: "intro",
      description: "One or two sentences shown under the headline.",
      type: "text",
      rows: 3,
      group: "profile",
    }),
    defineField({
      name: "portrait",
      type: "image",
      group: "profile",
      options: { hotspot: true },
      fields: [defineField({ name: "alt", title: "Alternative text", type: "string" })],
    }),
    defineField({
      name: "availableForWork",
      title: "Open to new opportunities",
      type: "boolean",
      group: "profile",
      initialValue: false,
    }),
    defineField({
      name: "bio",
      title: "About text",
      type: "array",
      group: "about",
      of: [
        defineArrayMember({
          type: "block",
          styles: [{ title: "Normal", value: "normal" }],
          lists: [],
        }),
      ],
    }),
    defineField({
      name: "skills",
      description: "Tools and technologies you work with.",
      type: "array",
      group: "about",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
    defineField({
      name: "featuredPhotos",
      title: "Photos on the home page",
      description:
        "Shown in the photography section on the home page, in this order. Leave empty to show the six most recent photos.",
      type: "array",
      group: "home",
      of: [defineArrayMember({ type: "reference", to: [{ type: "photo" }] })],
      validation: (rule) => rule.unique().max(12),
    }),
    defineField({ name: "location", type: "string", group: "contact" }),
    defineField({
      name: "email",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "contact",
      of: [
        defineArrayMember({
          type: "object",
          name: "socialLink",
          fields: [
            defineField({
              name: "platform",
              type: "string",
              options: { list: [...SOCIAL_PLATFORMS] },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              type: "url",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: { select: { title: "platform", subtitle: "url" } },
        }),
      ],
    }),
    defineField({
      name: "seo",
      title: "SEO defaults",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "title", type: "string" }),
        defineField({ name: "description", type: "text", rows: 3 }),
        defineField({
          name: "ogImage",
          title: "Social share image",
          description: "1200×630 works best.",
          type: "image",
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: "Profile & settings" }) },
});
