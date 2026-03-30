import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import { AuthorChip } from "@/components/author-chip";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="overflow-hidden">
      <div className="grid gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
        <Link href={`/blogs/${post.slug}`} className="block border-b border-border md:border-r md:border-b-0">
          <div
            className="h-40 w-full bg-cover bg-center md:h-full"
            style={{ backgroundImage: `url(${post.coverImageUrl})` }}
          />
        </Link>

        <div className="flex flex-col">
          <CardHeader className="gap-3 pb-3">
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-xl leading-tight md:text-2xl">
                <Link href={`/blogs/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
              <CardDescription>{post.excerpt}</CardDescription>
            </div>
          </CardHeader>

          <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 pb-4 text-xs text-muted-foreground">
            <span>{formatShortDate(post.publishedAt)}</span>
            <span className="inline-flex items-center gap-1">
              <Clock3 className="size-3.5" />
              {post.readingTimeMinutes} min read
            </span>
            <span>{formatCompactNumber(post.views)} views</span>
          </CardContent>

          <CardFooter className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
            <AuthorChip author={post.author} />
            <Link
              href={`/blogs/${post.slug}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Read
              <ArrowUpRight className="size-4" />
            </Link>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
