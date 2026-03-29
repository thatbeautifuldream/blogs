import type { Metadata } from "next"
import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { PostCard } from "@/components/post-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCaller } from "@/trpc/server"

export const metadata: Metadata = {
  title: "All blogs | Blogs",
  description: "Browse recent writing from the demo blog product.",
}

export default async function BlogsPage() {
  const caller = await getCaller()
  const [posts, explore] = await Promise.all([
    caller.content.blogList(),
    caller.content.explore(),
  ])

  return (
    <AppShell>
      <section className="grid gap-6 rounded-[2rem] border border-border/60 bg-background/85 p-8 shadow-sm lg:grid-cols-[1fr_18rem] lg:p-10">
        <div className="space-y-5">
          <Badge variant="secondary" className="w-fit">
            All writing
          </Badge>
          <div className="max-w-3xl space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              A believable catalog, not a placeholder archive.
            </h1>
            <p className="text-lg leading-8 text-muted-foreground">
              These posts come from a typed content repository that reads from
              Postgres when available and falls back to seeded demo content when it
              is not.
            </p>
          </div>
        </div>
        <Card className="border-border/60 bg-muted/30">
          <CardContent className="space-y-3 p-6">
            <div className="text-sm font-medium">Popular topics</div>
            <div className="flex flex-wrap gap-2">
              {explore.topics.map((topic) => (
                <Badge key={topic.label} variant="outline">
                  {topic.label} · {topic.count}
                </Badge>
              ))}
            </div>
            <Button asChild className="mt-2 w-full">
              <Link href="/editor">Start a draft</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </section>
    </AppShell>
  )
}
