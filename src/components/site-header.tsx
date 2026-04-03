import Link from "next/link";
import { PenSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/u/milind", label: "Profile" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-base font-semibold tracking-tight">
          Blog
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Button size="sm" asChild>
          <Link href="/editor">
            <PenSquare className="size-4" />
            Write
          </Link>
        </Button>
      </div>
    </header>
  );
}
