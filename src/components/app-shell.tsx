import { SiteHeader } from "@/components/site-header"

export function AppShell({
  children,
  tone = "default",
}: {
  children: React.ReactNode
  tone?: "default" | "warm"
}) {
  return (
    <div className="min-h-screen">
      <div
        className={
          tone === "warm"
            ? "absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(246,219,196,0.6),_transparent_45%),radial-gradient(circle_at_top_right,_rgba(181,221,214,0.4),_transparent_40%)]"
            : "absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top_left,_rgba(230,237,246,0.8),_transparent_40%),radial-gradient(circle_at_top_right,_rgba(246,229,214,0.7),_transparent_38%)]"
        }
      />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-8 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  )
}
