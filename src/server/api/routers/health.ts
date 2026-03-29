import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const healthRouter = createTRPCRouter({
  ping: publicProcedure.query(() => {
    return {
      ok: true,
      message: "blogs api is ready",
      timestamp: new Date().toISOString(),
    };
  }),
});
