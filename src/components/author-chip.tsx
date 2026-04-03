import Link from "next/link";

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
    <div className="min-w-0">
      <div className="truncate text-sm font-medium">{author.name}</div>
      {subtitle && (
        <div className="truncate text-xs text-muted-foreground">
          {subtitle}
        </div>
      )}
    </div>
  );

  if (!linked) {
    return <div>{content}</div>;
  }

  return (
    <Link
      href={`/u/${author.username}`}
      className="hover:text-foreground transition-colors"
    >
      {content}
    </Link>
  );
}
