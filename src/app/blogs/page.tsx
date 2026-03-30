import type { Metadata } from "next";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getCaller } from "@/trpc/server";

export const metadata: Metadata = {
  title: "All blogs | Blogs",
  description: "Browse recent writing from the demo blog product.",
};

export default async function BlogsPage() {
  const caller = await getCaller();
  const [posts, explore] = await Promise.all([
    caller.content.blogList(),
    caller.content.explore(),
  ]);

  return (
    <AppShell>
      <section className="grid gap-px border border-border bg-border lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4 bg-background p-5 md:p-6">
          <Badge variant="outline" className="w-fit">
            All blogs
          </Badge>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              A believable catalog, not a placeholder archive.
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
              These posts come from a typed content repository that reads from
              Postgres when available and falls back to seeded demo content when it
              is not.
            </p>
          </div>
        </div>

        <Card className="border-0 bg-background">
          <CardContent className="space-y-3 py-5">
            <div className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
              Popular topics
            </div>
            <div className="flex flex-wrap gap-2">
              {explore.topics.map((topic) => (
                <Badge key={topic.label} variant="outline">
                  {topic.label} · {topic.count}
                </Badge>
              ))}
            </div>
            <Button asChild className="w-full">
              <Link href="/editor">Start a draft</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
    </AppShell>
  );
}
