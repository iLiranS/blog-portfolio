// content-collections.ts
import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";
import { remarkPlugins } from "@prose-ui/core";
var posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: z.object({
    content: z.string()
  }),
  transform: async (document, context) => {
    const mdx = await compileMDX(context, document, {
      remarkPlugins: remarkPlugins()
    });
    return {
      ...document,
      mdx
    };
  }
});
var content_collections_default = defineConfig({
  collections: [posts]
});
export {
  content_collections_default as default
};
