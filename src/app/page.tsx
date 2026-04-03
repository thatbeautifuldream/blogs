import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AuthorChip } from "@/components/author-chip";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCaller } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Blog",
  description: "A minimal blog platform for writing that matters.",
};

export default async function Home() {
  const caller = await getCaller();
  const explore = await caller.content.explore();

  return (
    <>
      <section className="space-y-6">
        <Badge variant="outline">Featured</Badge>
        <div className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight leading-tight md:text-6xl lg:text-7xl">
            {explore.heroPost.title}
          </h1>
          <p className="max-w-2xl text-lg leading-7 text-muted-foreground md:text-xl">
            {explore.heroPost.excerpt}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button asChild>
            <Link href={`/blogs/${explore.heroPost.slug}`}>
              Read story
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/blogs">Browse all</Link>
          </Button>
        </div>
        <AuthorChip author={explore.heroPost.author} subtitle={`${explore.heroPost.readingTimeMinutes} min read`} />
      </section>

      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Recent posts</h2>
          <p className="text-base text-muted-foreground">
            Latest stories from the community.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {explore.recentPosts.slice(0, 4).map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Topics</h2>
          <p className="text-base text-muted-foreground">
            Explore by category.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {explore.topics.map((topic) => (
            <Badge key={topic.label} variant="outline" className="text-base px-4 py-2">
              {topic.label} <span className="ml-2 text-muted-foreground">{topic.count}</span>
            </Badge>
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight">Authors</h2>
          <p className="text-base text-muted-foreground">
            Meet the writers.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {explore.authors.map((author) => (
            <Link
              key={author.username}
              href={`/u/${author.username}`}
              className="group flex items-center justify-between gap-4 rounded-lg border border-border p-5 hover:bg-muted transition-colors"
            >
              <div className="min-w-0">
                <div className="font-medium">{author.name}</div>
                <div className="text-sm text-muted-foreground truncate">{author.headline}</div>
              </div>
              <div className="text-sm text-muted-foreground shrink-0 tabular-nums">
                {author.totalPosts} posts
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
