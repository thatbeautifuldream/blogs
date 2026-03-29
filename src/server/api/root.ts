import { createTRPCRouter, createCallerFactory } from "@/server/api/trpc";
import { contentRouter } from "@/server/api/routers/content";
import { healthRouter } from "@/server/api/routers/health";
import { postsRouter } from "@/server/api/routers/posts";

export const appRouter = createTRPCRouter({
  content: contentRouter,
  health: healthRouter,
  posts: postsRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
