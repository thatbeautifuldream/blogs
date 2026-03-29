import Link from "next/link"
import { PenSquare, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const navigation = [
  { href: "/", label: "Explore" },
  { href: "/blogs", label: "Blogs" },
  { href: "/u/milind", label: "Profile" },
  { href: "/editor", label: "Editor" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-4" />
          </div>
          <div className="space-y-0.5">
            <div className="text-sm font-semibold tracking-tight">Blogs</div>
            <div className="text-xs text-muted-foreground">
              Editorial publishing, no auth yet
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navigation.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="hidden sm:inline-flex">
            Phase 2 demo
          </Badge>
          <Button size="sm" asChild>
            <Link href="/editor">
              <PenSquare className="size-4" />
              Write
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
