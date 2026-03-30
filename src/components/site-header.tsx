import Link from "next/link";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/", label: "Explore" },
  { href: "/blogs", label: "Blogs" },
  { href: "/u/milind", label: "Profile" },
  { href: "/editor", label: "Editor" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="text-sm font-bold tracking-tight text-foreground">
            Blogs
          </Link>

          <nav className="hidden items-center gap-4 text-sm md:flex">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="text-muted-foreground hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">HN-style system</span>
          <Button size="sm" asChild>
            <Link href="/editor">
              <PenSquare className="size-4" />
              Write
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
