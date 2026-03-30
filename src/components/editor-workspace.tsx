"use client";

import { useMemo, useState } from "react";
import Editor from "@monaco-editor/react";
import { Sparkles } from "lucide-react";
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
    <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
      <div className="space-y-5">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="space-y-2">
              <Badge variant="outline" className="w-fit">
                Editor
              </Badge>
              <CardTitle className="text-2xl md:text-3xl">Compose a new story</CardTitle>
              <CardDescription className="max-w-2xl">
                Dense, practical writing surface with Monaco on the left and a
                Streamdown preview on the right.
              </CardDescription>
            </div>
            <AuthorChip author={editor.author} subtitle={editor.author.headline} />
          </CardHeader>

          <CardContent className="space-y-5 py-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Title
                </label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label htmlFor="slug" className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  Slug
                </label>
                <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="cover" className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Cover image URL
              </label>
              <Input id="cover" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label htmlFor="excerpt" className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Excerpt
              </label>
              <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={4} />
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  <label htmlFor="content">Markdown body</label>
                  <span>{inferredReadingTime} min read</span>
                </div>
                <div className="overflow-hidden border border-border bg-background">
                  <Editor
                    height="640px"
                    defaultLanguage="markdown"
                    language="markdown"
                    value={content}
                    onChange={(value) => setContent(value ?? "")}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineHeight: 22,
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
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                  <span>Live preview</span>
                  <Badge variant="outline">Streamdown</Badge>
                </div>
                <div className="min-h-[640px] border border-border bg-background px-5 py-5">
                  <div className="space-y-3 border-b border-border pb-4">
                    <div className="text-2xl font-bold tracking-tight">{title}</div>
                    <div className="text-sm leading-6 text-muted-foreground">{excerpt}</div>
                    <div className="flex flex-wrap gap-2">
                      {editor.draft.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <MarkdownRenderer content={content} className="prose prose-neutral mt-5 max-w-none dark:prose-invert" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Publishing checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pb-5 text-sm text-muted-foreground">
            {editor.checklist.map((item) => (
              <div key={item} className="border border-border px-3 py-3">
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Suggested nearby reads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pb-5">
            {editor.suggestions.map((suggestion, index) => (
              <div key={suggestion.slug} className="space-y-3">
                {index > 0 ? <Separator /> : null}
                <div className="space-y-1">
                  <Badge variant="outline">{suggestion.tag}</Badge>
                  <div className="text-sm font-semibold leading-6">{suggestion.title}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
