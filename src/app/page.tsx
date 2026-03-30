import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AuthorChip } from "@/components/author-chip";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/content-format";
import { getCaller } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Explore | Blogs",
  description: "Explore stories, authors, and topics in the phase-2 blog product.",
};

export default async function Home() {
  const caller = await getCaller();
  const explore = await caller.content.explore();

  return (
    <AppShell>
      <section className="grid gap-px border border-border bg-border lg:grid-cols-[minmax(0,1.3fr)_20rem]">
        <div className="space-y-6 bg-background p-5 md:p-6">
          <Badge variant="outline" className="w-fit">
            Explore
          </Badge>
          <div className="space-y-3">
            <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-5xl">
              A dense, utilitarian publishing surface for writing that matters.
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              Browse strong seeded writing, jump into real route flows, and inspect
              a no-auth editor that keeps the future DB path clean.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/blogs/${explore.heroPost.slug}`}>
                Read the lead story
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/blogs">Open all blogs</Link>
            </Button>
          </div>

          <div className="border border-border p-4">
            <AuthorChip author={explore.heroPost.author} subtitle={`${explore.heroPost.readingTimeMinutes} min read`} />
          </div>
        </div>

        <div className="bg-background p-4 md:p-5">
          <div className="hn-section-title">Lead story</div>
          <Link href={`/blogs/${explore.heroPost.slug}`} className="mt-3 block border border-border p-4 hover:bg-muted">
            <div
              className="mb-4 h-48 w-full border border-border bg-cover bg-center"
              style={{ backgroundImage: `url(${explore.heroPost.coverImageUrl})` }}
            />
            <div className="text-lg font-bold leading-tight">{explore.heroPost.title}</div>
            <div className="mt-2 text-sm leading-6 text-muted-foreground">{explore.heroPost.excerpt}</div>
          </Link>
        </div>
      </section>

      <section className="grid gap-px border border-border bg-border xl:grid-cols-[1fr_1fr]">
        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-base">Topics</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-px bg-border pb-5 md:grid-cols-2">
            {explore.topics.map((topic) => (
              <div key={topic.label} className="flex items-center justify-between bg-background px-4 py-3 text-sm">
                <span className="font-medium">{topic.label}</span>
                <span className="text-muted-foreground">{topic.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0">
          <CardHeader>
            <CardTitle className="text-base">Active authors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-px bg-border pb-5">
            {explore.authors.map((author) => (
              <Link key={author.username} href={`/u/${author.username}`} className="flex items-center justify-between gap-4 bg-background px-4 py-4 hover:bg-muted">
                <AuthorChip author={author} subtitle={author.headline} linked={false} />
                <div className="text-right text-xs text-muted-foreground">
                  <div>{author.totalPosts} posts</div>
                  <div>{formatCompactNumber(author.totalViews)} reads</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Featured stories</h2>
            <p className="text-sm text-muted-foreground">Editorial picks from the current content set.</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/blogs">See all</Link>
          </Button>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {explore.featuredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="border border-border">
        <div className="border-b border-border px-4 py-3 text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Recent on Blogs
        </div>
        <div className="grid gap-px bg-border md:grid-cols-2">
          {explore.recentPosts.map((post) => (
            <Link key={post.slug} href={`/blogs/${post.slug}`} className="block bg-background px-4 py-4 hover:bg-muted">
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="mt-3 text-lg font-bold leading-tight">{post.title}</div>
              <div className="mt-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
