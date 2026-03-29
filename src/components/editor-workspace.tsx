"use client";

import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { PenLine, Sparkles } from "lucide-react";
import { AuthorChip } from "@/components/author-chip";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type EditorWorkspaceProps = {
  editor: {
    draft: {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      coverImageUrl: string;
      tags: string[];
    };
    author: {
      id: number;
      username: string;
      name: string;
      bio: string;
      headline: string;
      avatarUrl: string;
      location: string;
      website: string;
      twitter: string;
      github: string;
      joinedAt: Date;
      posts: unknown[];
      totalViews: number;
      totalPosts: number;
      topicCount: number;
    };
    suggestions: Array<{
      slug: string;
      title: string;
      tag: string;
    }>;
    checklist: string[];
  };
};

export function EditorWorkspace({ editor }: EditorWorkspaceProps) {
  const [title, setTitle] = useState(editor.draft.title);
  const [slug, setSlug] = useState(editor.draft.slug);
  const [coverImageUrl, setCoverImageUrl] = useState(editor.draft.coverImageUrl);
  const [excerpt, setExcerpt] = useState(editor.draft.excerpt);
  const [content, setContent] = useState(editor.draft.content);

  const inferredReadingTime = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [content]);

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="space-y-6">
        <Card className="border-border/60 bg-background/90">
          <CardHeader className="space-y-4 border-b border-border/60 pb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="secondary" className="w-fit">
                  Monaco editor + Streamdown preview
                </Badge>
                <CardTitle className="text-3xl">Compose a new story</CardTitle>
                <CardDescription className="max-w-2xl text-sm leading-6">
                  A realistic no-auth writing surface: Monaco for drafting and
                  Streamdown for live preview, ready for real mutations in the
                  next phase.
                </CardDescription>
              </div>
              <div className="hidden rounded-3xl bg-muted/50 p-3 lg:block">
                <PenLine className="size-6 text-muted-foreground" />
              </div>
            </div>
            <AuthorChip author={editor.author} subtitle={editor.author.headline} />
          </CardHeader>
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Title
                </label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">
                  Slug
                </label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="cover" className="text-sm font-medium">
                Cover image URL
              </label>
              <Input
                id="cover"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-sm font-medium">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="content" className="text-sm font-medium">
                    Markdown body
                  </label>
                  <div className="text-xs text-muted-foreground">
                    {inferredReadingTime} min read estimate
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-background shadow-sm">
                  <Editor
                    height="640px"
                    defaultLanguage="markdown"
                    language="markdown"
                    value={content}
                    onChange={(value) => setContent(value ?? "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      lineHeight: 24,
                      wordWrap: "on",
                      scrollBeyondLastLine: false,
                      padding: { top: 20, bottom: 20 },
                      roundedSelection: true,
                      overviewRulerBorder: false,
                      automaticLayout: true,
                    }}
                    theme="vs-dark"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Live preview</div>
                  <Badge variant="outline">Streamdown</Badge>
                </div>
                <div className="min-h-[640px] rounded-2xl border border-border/60 bg-background px-6 py-6 shadow-sm">
                  <div className="space-y-3 border-b border-border/60 pb-5">
                    <div className="text-3xl font-semibold tracking-tight">{title}</div>
                    <div className="text-base leading-7 text-muted-foreground">
                      {excerpt}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editor.draft.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <MarkdownRenderer
                    content={content}
                    className="prose prose-zinc mt-6 max-w-none dark:prose-invert"
                  />
                </div>
              </div>
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
      </div>

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
              This branch upgrades the editor surface and markdown rendering path.
              Real persistence and publish actions still come next.
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
