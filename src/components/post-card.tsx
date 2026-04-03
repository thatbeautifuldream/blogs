import Link from "next/link";
import { Clock3 } from "lucide-react";
import { AuthorChip } from "@/components/author-chip";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatCompactNumber, formatShortDate } from "@/lib/content-format";

type PostCardProps = {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    coverImageUrl: string;
    publishedAt: Date | null;
    readingTimeMinutes: number;
    views: number;
    author: {
      username: string;
      name: string;
      avatarUrl: string;
      headline?: string;
    };
    tags: string[];
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="group flex flex-col">
      <CardContent className="flex-1 space-y-4 p-6">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="space-y-3">
          <Link href={`/blogs/${post.slug}`}>
            <h3 className="text-xl font-semibold tracking-tight leading-tight hover:underline">
              {post.title}
            </h3>
          </Link>
          <p className="text-sm leading-7 text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-muted-foreground">
          <span>{formatShortDate(post.publishedAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="size-3.5" />
            {post.readingTimeMinutes} min
          </span>
          <span className="tabular-nums">{formatCompactNumber(post.views)} views</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t border-border px-6 py-4">
        <AuthorChip author={post.author} />
        <Link
          href={`/blogs/${post.slug}`}
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Read →
        </Link>
      </CardFooter>
    </Card>
  );
}
