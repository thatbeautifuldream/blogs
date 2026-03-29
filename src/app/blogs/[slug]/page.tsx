import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Clock3, Eye } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AuthorChip } from "@/components/author-chip"
import { MarkdownRenderer } from "@/components/markdown-renderer"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatCompactNumber, formatLongDate } from "@/lib/content-format"
import { getCaller } from "@/trpc/server"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const caller = await getCaller()
  const post = await caller.content.blogBySlug({ slug })

  if (!post) {
    return {
      title: "Post not found | Blogs",
    }
  }

  return {
    title: `${post.title} | Blogs`,
    description: post.excerpt,
  }
}

export async function generateStaticParams() {
  const caller = await getCaller()
  const posts = await caller.content.blogList()

  return posts.map((post) => ({ slug: post.slug }))
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const caller = await getCaller()
  const [post, relatedPosts] = await Promise.all([
    caller.content.blogBySlug({ slug }),
    caller.content.relatedPosts({ slug }),
  ])

  if (!post) {
    notFound()
  }

  return (
    <AppShell tone="warm">
      <div className="space-y-8">
        <Button variant="ghost" size="sm" asChild className="w-fit">
          <Link href="/blogs">
            <ArrowLeft className="size-4" />
            Back to all blogs
          </Link>
        </Button>

        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="max-w-3xl space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
                {post.title}
              </h1>
              <p className="text-lg leading-8 text-muted-foreground">
                {post.excerpt}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-sm text-muted-foreground">
              <span>{formatLongDate(post.publishedAt)}</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-4" />
                {post.readingTimeMinutes} min read
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye className="size-4" />
                {formatCompactNumber(post.views)} views
              </span>
            </div>
            <AuthorChip author={post.author} subtitle={post.author.headline} />
          </div>

          <div
            className="min-h-72 rounded-[2rem] border border-border/60 bg-cover bg-center shadow-sm"
            style={{ backgroundImage: `url(${post.coverImageUrl})` }}
          />
        </section>

        <Separator />

        <section className="grid gap-8 lg:grid-cols-[1fr_18rem]">
          <Card className="border-border/60 bg-background/90">
            <CardContent className="px-8 py-8 sm:px-10 sm:py-10">
              <MarkdownRenderer
                content={post.content}
                className="prose prose-zinc max-w-none dark:prose-invert"
              />
            </CardContent>
          </Card>

          <aside className="space-y-4">
            <Card className="border-border/60 bg-background/90">
              <CardContent className="space-y-4 p-6">
                <div className="text-sm font-medium">Reading notes</div>
                <div className="text-sm leading-6 text-muted-foreground">
                  This phase-2 detail page is DB-ready but will fall back to local
                  demo content if Postgres is not available.
                </div>
              </CardContent>
            </Card>
            <Card className="border-border/60 bg-background/90">
              <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
                <div className="font-medium text-foreground">Next routes</div>
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

        <section className="space-y-5">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Related reading</h2>
            <p className="text-sm text-muted-foreground">
              Nearby posts pulled from the same typed content layer.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.slug} post={relatedPost} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  )
}
