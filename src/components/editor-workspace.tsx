"use client";

import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Sparkles } from "lucide-react";
import { AuthorChip } from "@/components/author-chip";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
  const [excerpt, setExcerpt] = useState(editor.draft.excerpt);
  const [content, setContent] = useState(editor.draft.content);

  const inferredReadingTime = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [content]);

  return (
    <>
      <section className="space-y-6">
        <Badge variant="outline">Editor</Badge>
        <div className="space-y-4">
          <h1 className="text-5xl font-semibold tracking-tight leading-tight md:text-6xl lg:text-7xl">
            Write a new story
          </h1>
          <p className="max-w-2xl text-lg leading-7 text-muted-foreground md:text-xl">
            Create and preview your content with live markdown rendering.
          </p>
        </div>
        <AuthorChip author={editor.author} subtitle={editor.author.headline} />
      </section>

      <section className="space-y-8">
        <Card>
          <CardContent className="space-y-6 p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Title
                </label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Slug
                </label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Excerpt
              </label>
              <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <label htmlFor="content">Content</label>
              <span className="tabular-nums">{inferredReadingTime} min read</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-border">
              <Editor
                height="480px"
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
                  padding: { top: 16, bottom: 16 },
                  roundedSelection: false,
                  overviewRulerBorder: false,
                  automaticLayout: true,
                }}
                theme="vs-dark"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button>
                <Sparkles className="size-4" />
                Save draft
              </Button>
              <Button variant="outline">Preview</Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold">Preview</h3>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold tracking-tight">{title}</h4>
                  <p className="text-sm leading-6 text-muted-foreground">{excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {editor.draft.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="border-t border-border pt-4">
                  <MarkdownRenderer content={content} className="prose prose-neutral prose-sm max-w-none dark:prose-invert" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3 p-6">
                <h3 className="text-lg font-semibold">Checklist</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {editor.checklist.map((item) => (
                    <div key={item} className="flex items-start gap-2">
                      <span className="text-primary shrink-0">✓</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
}
