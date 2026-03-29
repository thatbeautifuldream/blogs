import type { Metadata } from "next"
import { PenLine, Sparkles } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { AuthorChip } from "@/components/author-chip"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { getCaller } from "@/trpc/server"

export const metadata: Metadata = {
  title: "Editor | Blogs",
  description: "Local-first draft composition for the no-auth phase.",
}

export default async function EditorPage() {
  const caller = await getCaller()
  const editor = await caller.content.editorBootstrap()

  return (
    <AppShell tone="warm">
      <section className="grid gap-8 lg:grid-cols-[1fr_20rem]">
        <Card className="border-border/60 bg-background/90">
          <CardHeader className="space-y-4 border-b border-border/60 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  Editor demo
                </Badge>
                <CardTitle className="text-3xl">Compose a new story</CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-6">
                  This is intentionally no-auth for phase 2. The surface area is
                  real, the content is believable, and the persistence layer can be
                  wired in later without changing the page shape.
                </CardDescription>
              </div>
              <div className="hidden rounded-3xl bg-muted/50 p-3 lg:block">
                <PenLine className="size-6 text-muted-foreground" />
              </div>
            </div>
            <AuthorChip author={editor.author} subtitle={editor.author.headline} />
          </CardHeader>
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input id="title" defaultValue={editor.draft.title} />
            </div>
            <div className="space-y-2">
              <label htmlFor="slug" className="text-sm font-medium">
                Slug
              </label>
              <Input id="slug" defaultValue={editor.draft.slug} />
            </div>
            <div className="space-y-2">
              <label htmlFor="cover" className="text-sm font-medium">
                Cover image URL
              </label>
              <Input id="cover" defaultValue={editor.draft.coverImageUrl} />
            </div>
            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt
              </label>
              <Textarea id="excerpt" defaultValue={editor.draft.excerpt} rows={4} />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Body
              </label>
              <Textarea
                id="content"
                defaultValue={editor.draft.content}
                rows={16}
                className="leading-7"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button>
                <Sparkles className="size-4" />
                Save draft
              </Button>
              <Button variant="outline">Preview post</Button>
              <Button variant="secondary">Publish later</Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="border-border/60 bg-background/90">
            <CardHeader>
              <CardTitle className="text-lg">Publishing checklist</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pb-6 text-sm text-muted-foreground">
              {editor.checklist.map((item) => (
                <div key={item} className="rounded-2xl bg-muted/40 px-4 py-3">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/90">
            <CardHeader>
              <CardTitle className="text-lg">Suggested nearby reads</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pb-6">
              {editor.suggestions.map((suggestion, index) => (
                <div key={suggestion.slug} className="space-y-3">
                  {index > 0 ? <Separator /> : null}
                  <div className="space-y-1">
                    <Badge variant="outline">{suggestion.tag}</Badge>
                    <div className="font-medium leading-6">{suggestion.title}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-muted/30">
            <CardContent className="space-y-2 p-6 text-sm text-muted-foreground">
              <div className="font-medium text-foreground">Phase note</div>
              <div>
                Buttons are present to validate the product flow, but auth and
                persistence are intentionally deferred.
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  )
}
