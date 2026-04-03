"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "@/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

// Custom structure to make siteSettings a singleton
const singletonStructure = (S: any) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings")
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem: any) => !["siteSettings"].includes(listItem.getId())
      ),
    ]);

export default defineConfig({
  name: "rkay-construction-cms",
  title: "R Kay Construction CMS",
  projectId,
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool({ structure: singletonStructure }),
  ],
  schema: {
    types: schemaTypes,
  },
});
