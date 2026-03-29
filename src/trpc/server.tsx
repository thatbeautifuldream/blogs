import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import superjson from "superjson";
import type { AppRouter } from "@/server/api/root";
import { createCaller, appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { makeQueryClient } from "@/trpc/query-client";

export const getQueryClient = cache(makeQueryClient);

export const getCaller = cache(async () => {
  const ctx = await createTRPCContext();
  return createCaller(ctx);
});

function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export const trpc = createTRPCOptionsProxy<AppRouter>({
  queryClient: getQueryClient,
  client: createTRPCClient<AppRouter>({
    links: [
      httpBatchLink({
        url: `${getBaseUrl()}/api/trpc`,
        transformer: superjson,
      }),
    ],
  }),
});

export function prefetch<T>(queryOptions: T) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    queryOptions as Parameters<typeof queryClient.prefetchQuery>[0],
  );
}

export function HydrateClient({ children }: { children: React.ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      {children}
    </HydrationBoundary>
  );
}

void appRouter;
