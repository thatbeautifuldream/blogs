import { SiteHeader } from "@/components/site-header";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
  tone?: "default" | "warm";
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
