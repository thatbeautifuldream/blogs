import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { initials } from "@/lib/content-format"

type AuthorChipProps = {
  author: {
    username: string
    name: string
    avatarUrl: string
    headline?: string
  }
  subtitle?: string
  linked?: boolean
}

export function AuthorChip({
  author,
  subtitle,
  linked = true,
}: AuthorChipProps) {
  const content = (
    <>
      <Avatar className="size-11">
        <AvatarImage src={author.avatarUrl} alt={author.name} />
        <AvatarFallback>{initials(author.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium">{author.name}</div>
        <div className="truncate text-sm text-muted-foreground">
          {subtitle ?? author.headline ?? `@${author.username}`}
        </div>
      </div>
    </>
  )

  if (!linked) {
    return <div className="inline-flex items-center gap-3">{content}</div>
  }

  return (
    <Link
      href={`/u/${author.username}`}
      className="inline-flex items-center gap-3 rounded-2xl transition-colors hover:bg-muted/50"
    >
      {content}
    </Link>
  )
}
