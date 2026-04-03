import { SiteHeader } from "@/components/site-header";

export function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-6 md:py-16 lg:py-20">
        <div className="space-y-16 md:space-y-20 lg:space-y-24">
          {children}
        </div>
      </main>
    </div>
  );
}
