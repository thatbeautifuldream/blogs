import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, Eye } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { AuthorChip } from "@/components/author-chip";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { PostCard } from "@/components/post-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
      title: "Post not found | Blogs",
    };
  }

  return {
    title: `${post.title} | Blogs`,
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
    <AppShell>
      <div className="space-y-6">
        <Button variant="ghost" size="sm" asChild className="w-fit">
          <Link href="/blogs">
            <ArrowLeft className="size-4" />
            Back to all blogs
          </Link>
        </Button>

        <section className="grid gap-px border border-border bg-border lg:grid-cols-[minmax(0,1.2fr)_18rem]">
          <div className="space-y-5 bg-background p-5 md:p-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="max-w-4xl space-y-4">
              <h1 className="text-4xl font-bold tracking-tight md:text-5xl">{post.title}</h1>
              <p className="text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                {post.excerpt}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <span>{formatLongDate(post.publishedAt)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3.5" />
                {post.readingTimeMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="size-3.5" />
                {formatCompactNumber(post.views)} views
              </span>
            </div>

            <AuthorChip author={post.author} subtitle={post.author.headline} />
          </div>

          <div className="bg-background p-4 md:p-5">
            <div
              className="h-full min-h-64 border border-border bg-cover bg-center"
              style={{ backgroundImage: `url(${post.coverImageUrl})` }}
            />
          </div>
        </section>

        <Separator />

        <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <Card>
            <CardContent className="py-5">
              <MarkdownRenderer content={post.content} className="prose prose-neutral max-w-none dark:prose-invert" />
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card>
              <CardContent className="space-y-4 py-5">
                <div className="text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Reading notes
                </div>
                <div className="text-sm leading-6 text-muted-foreground">
                  This detail page is DB-ready but will fall back to local demo
                  content if Postgres is not available.
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="space-y-3 py-5 text-sm text-muted-foreground">
                <div className="font-bold uppercase tracking-[0.14em] text-foreground">
                  Next routes
                </div>
                <Link href={`/u/${post.author.username}`} className="block hover:text-foreground">
                  View author profile
                </Link>
                <Link href="/editor" className="block hover:text-foreground">
                  Open editor demo
                </Link>
                <Link href="/blogs" className="block hover:text-foreground">
                  Browse more posts
                </Link>
              </CardContent>
            </Card>
          </aside>
        </section>

        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">Related reading</h2>
            <p className="text-sm text-muted-foreground">
              Nearby posts pulled from the same typed content layer.
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
