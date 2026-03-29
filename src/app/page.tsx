import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const foundations = [
  "Next.js App Router",
  "tRPC v11",
  "TanStack Query",
  "Drizzle ORM",
  "Postgres",
  "shadcn/ui",
];

const routes = [
  { label: "Explore", href: "/" },
  { label: "Blogs", href: "/blogs" },
  { label: "Profile", href: "/u/milind" },
  { label: "Editor", href: "/editor" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-16 lg:px-10">
        <div className="flex flex-col gap-4">
          <Badge variant="secondary" className="w-fit">
            Foundation ready
          </Badge>
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Blogs is scaffolded for a no-auth, type-safe publishing system.
            </h1>
            <p className="text-base text-muted-foreground sm:text-lg">
              The app now has the core architecture for building a real blog
              product with typed backend and frontend flows before auth enters
              the picture.
            </p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {foundations.map((item) => (
            <div
              key={item}
              className="rounded-2xl border bg-background p-5 shadow-sm"
            >
              <p className="text-sm font-medium text-muted-foreground">
                Enabled stack
              </p>
              <h2 className="mt-2 text-xl font-semibold">{item}</h2>
            </div>
          ))}
        </section>

        <section className="grid gap-6 rounded-3xl border bg-background p-6 shadow-sm lg:grid-cols-[1.3fr_0.7fr] lg:p-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold tracking-tight">
              Recommended next build order
            </h2>
            <ol className="space-y-3 text-sm text-muted-foreground sm:text-base">
              <li>1. Create migrations and run the local Postgres database.</li>
              <li>2. Seed a default author, profile, tags, and a few posts.</li>
              <li>3. Build the explore and blog list routes.</li>
              <li>4. Add the post detail page and profile route.</li>
              <li>5. Build the editor with tRPC mutations.</li>
            </ol>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl border bg-muted/40 p-4">
            <p className="text-sm font-medium text-muted-foreground">
              Planned routes
            </p>
            {routes.map((route) => (
              <div
                key={route.href}
                className="flex items-center justify-between rounded-xl bg-background px-4 py-3 text-sm"
              >
                <span>{route.label}</span>
                <span className="font-mono text-muted-foreground">
                  {route.href}
                </span>
              </div>
            ))}
            <Button className="mt-2" disabled>
              UI build starts next
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
