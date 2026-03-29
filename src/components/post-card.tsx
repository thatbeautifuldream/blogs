import Link from "next/link"
import { ArrowUpRight, Clock3 } from "lucide-react"
import { AuthorChip } from "@/components/author-chip"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCompactNumber, formatShortDate } from "@/lib/content-format"

type PostCardProps = {
  post: {
    slug: string
    title: string
    excerpt: string
    coverImageUrl: string
    publishedAt: Date | null
    readingTimeMinutes: number
    views: number
    author: {
      username: string
      name: string
      avatarUrl: string
      headline?: string
    }
    tags: string[]
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="overflow-hidden border-border/60 bg-background/90">
      <Link href={`/blogs/${post.slug}`} className="block">
        <div
          className="h-48 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${post.coverImageUrl})` }}
        />
      </Link>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="space-y-2">
          <CardTitle className="text-2xl leading-tight">
            <Link href={`/blogs/${post.slug}`} className="hover:text-primary">
              {post.title}
            </Link>
          </CardTitle>
          <CardDescription className="text-sm leading-6">
            {post.excerpt}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{formatShortDate(post.publishedAt)}</span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="size-4" />
          {post.readingTimeMinutes} min read
        </span>
        <span>{formatCompactNumber(post.views)} views</span>
      </CardContent>
      <CardFooter className="justify-between gap-3">
        <AuthorChip author={post.author} />
        <Link
          href={`/blogs/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Read
          <ArrowUpRight className="size-4" />
        </Link>
      </CardFooter>
    </Card>
  )
}
