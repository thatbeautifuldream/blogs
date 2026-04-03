import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Eye } from "lucide-react";
import { AuthorChip } from "@/components/author-chip";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCompactNumber, formatLongDate } from "@/lib/content-format";
import { getCaller } from "@/trpc/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caller = await getCaller();
  const post = await caller.content.blogBySlug({ slug });

  if (!post) {
    return {
      title: "Post not found | Blog",
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.excerpt,
  };
}

export async function generateStaticParams() {
  const caller = await getCaller();
  const posts = await caller.content.blogList();

  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caller = await getCaller();
  const [post, relatedPosts] = await Promise.all([
    caller.content.blogBySlug({ slug }),
    caller.content.relatedPosts({ slug }),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <>
      <article className="space-y-10">
        <Button variant="ghost" size="sm" asChild className="w-fit -ml-3">
          <Link href="/blogs">
            <ArrowLeft className="size-4" />
            Back
          </Link>
        </Button>

        <header className="space-y-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-semibold tracking-tight leading-tight md:text-6xl lg:text-7xl">
              {post.title}
            </h1>
            <p className="text-xl leading-8 text-muted-foreground md:text-2xl">
              {post.excerpt}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 gap-y-3 text-sm text-muted-foreground">
            <AuthorChip author={post.author} subtitle={post.author.headline} />
            <span>{formatLongDate(post.publishedAt)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-4" />
              {post.readingTimeMinutes} min
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye className="size-4" />
              <span className="tabular-nums">{formatCompactNumber(post.views)}</span>
            </span>
          </div>
        </header>

        <Card>
          <CardContent className="p-8 md:p-10">
            <MarkdownRenderer
              content={post.content}
              className="prose prose-neutral max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tight prose-p:leading-7 prose-p:text-muted-foreground"
            />
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3 pt-4">
          <Button asChild variant="outline">
            <Link href="/editor">Write a response</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/blogs">Browse more</Link>
          </Button>
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="space-y-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight">Related posts</h2>
            <p className="text-base text-muted-foreground">
              Continue reading.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
