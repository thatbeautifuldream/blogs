import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initials } from "@/lib/content-format";

type AuthorChipProps = {
  author: {
    username: string;
    name: string;
    avatarUrl: string;
    headline?: string;
  };
  subtitle?: string;
  linked?: boolean;
};

export function AuthorChip({
  author,
  subtitle,
  linked = true,
}: AuthorChipProps) {
  const content = (
    <>
      <Avatar className="size-9 border border-border">
        <AvatarImage src={author.avatarUrl} alt={author.name} />
        <AvatarFallback>{initials(author.name)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{author.name}</div>
        <div className="truncate text-xs text-muted-foreground">
          {subtitle ?? author.headline ?? `@${author.username}`}
        </div>
      </div>
    </>
  );

  if (!linked) {
    return <div className="inline-flex items-center gap-3">{content}</div>;
  }

  return (
    <Link
      href={`/u/${author.username}`}
      className="inline-flex items-center gap-3 hover:opacity-80"
    >
      {content}
    </Link>
  );
}
