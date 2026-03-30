import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AuthorChip } from "@/components/author-chip"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCompactNumber } from "@/lib/content-format"
import { getCaller } from "@/trpc/server"

export const metadata: Metadata = {
  title: "Explore | Blogs",
  description: "Explore stories, authors, and topics in the phase-2 blog product.",
}

export default async function Home() {
  const caller = await getCaller()
  const explore = await caller.content.explore()

  return (
    <AppShell tone="warm">
      <section>
        <Card className="overflow-hidden border-border/60 bg-background/90">
          <CardContent className="grid gap-8 p-6 sm:p-8 lg:gap-10 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,22rem)] xl:p-10">
            <div className="order-2 space-y-6 xl:order-1">
              <Badge variant="secondary" className="w-fit">
                Explore today
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl xl:text-[4.25rem] xl:leading-[0.95]">
                  A type-safe publishing product with enough surface area to feel
                  real already.
                </h1>
                <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                  Browse strong seeded writing, jump into real route flows, and
                  inspect a no-auth editor that keeps the future DB path clean.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 pt-1">
                <Button asChild size="lg">
                  <Link href={`/blogs/${explore.heroPost.slug}`}>
                    Read the lead story
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/blogs">Open all blogs</Link>
                </Button>
              </div>
              <AuthorChip
                author={explore.heroPost.author}
                subtitle={`${explore.heroPost.readingTimeMinutes} min read`}
              />
            </div>

            <div
              className="order-1 min-h-[18rem] rounded-[2rem] border border-border/60 bg-cover bg-center shadow-sm sm:min-h-[24rem] xl:order-2 xl:min-h-full"
              style={{ backgroundImage: `url(${explore.heroPost.coverImageUrl})` }}
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-border/60 bg-background/90">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <CardTitle className="text-lg">Trending topics</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Topics with active seeded coverage right now.
            </p>
          </CardHeader>
          <CardContent className="grid gap-3 pb-6 md:grid-cols-2 xl:grid-cols-3">
            {explore.topics.map((topic) => (
              <div
                key={topic.label}
                className="flex items-center justify-between rounded-2xl bg-muted/35 px-4 py-3"
              >
                <span className="font-medium">{topic.label}</span>
                <Badge variant="outline">{topic.count} posts</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Featured stories</h2>
            <p className="text-sm text-muted-foreground">
              Editorial picks from the current content set.
            </p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/blogs">See all</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {explore.featuredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(18rem,0.9fr)_minmax(0,1.1fr)]">
        <Card className="border-border/60 bg-background/90">
          <CardHeader>
            <CardTitle className="text-lg">Active authors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            {explore.authors.map((author) => (
              <Link
                key={author.username}
                href={`/u/${author.username}`}
                className="flex items-center justify-between gap-4 rounded-2xl bg-muted/35 px-4 py-4 transition-colors hover:bg-muted/55"
              >
                <AuthorChip author={author} subtitle={author.headline} linked={false} />
                <div className="text-right text-sm text-muted-foreground">
                  <div>{author.totalPosts} posts</div>
                  <div>{formatCompactNumber(author.totalViews)} reads</div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-background/90">
          <CardHeader>
            <CardTitle className="text-lg">Recent on Blogs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-6">
            {explore.recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blogs/${post.slug}`}
                className="block rounded-2xl border border-border/60 p-5 transition-colors hover:bg-muted/25"
              >
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="mt-3 text-xl font-semibold tracking-tight">
                  {post.title}
                </div>
                <div className="mt-2 text-sm leading-6 text-muted-foreground">
                  {post.excerpt}
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </section>
    </AppShell>
  )
}
