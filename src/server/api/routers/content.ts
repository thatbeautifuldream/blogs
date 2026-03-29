import { z } from "zod"
import {
  getBlogBySlug,
  getEditorData,
  getExploreData,
  getProfileByUsername,
  getRelatedPosts,
  listBlogPosts,
} from "@/server/content/repository"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

export const contentRouter = createTRPCRouter({
  explore: publicProcedure.query(async () => getExploreData()),
  blogList: publicProcedure.query(async () => listBlogPosts()),
  blogBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => getBlogBySlug(input.slug)),
  relatedPosts: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => getRelatedPosts(input.slug)),
  profileByUsername: publicProcedure
    .input(z.object({ username: z.string().min(1) }))
    .query(async ({ input }) => getProfileByUsername(input.username)),
  editorBootstrap: publicProcedure.query(async () => getEditorData()),
})
