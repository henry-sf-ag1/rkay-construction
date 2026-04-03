import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "companyName",
      title: "Company Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtagline",
      title: "Sub-tagline",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "about",
      title: "About",
      type: "object",
      fields: [
        defineField({
          name: "intro",
          title: "Introduction",
          type: "text",
          rows: 4,
        }),
        defineField({
          name: "values",
          title: "Values",
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Title",
                  type: "string",
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: "description",
                  title: "Description",
                  type: "text",
                  rows: 3,
                }),
              ],
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "social",
      title: "Social Media",
      type: "object",
      fields: [
        defineField({
          name: "facebook",
          title: "Facebook URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
        }),
        defineField({
          name: "instagram",
          title: "Instagram URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn URL",
          type: "url",
          validation: (Rule) =>
            Rule.uri({ allowRelative: true, scheme: ["http", "https"] }),
        }),
      ],
    }),
    defineField({
      name: "projectTypes",
      title: "Project Types (for quote form)",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    select: { title: "companyName" },
  },
});
