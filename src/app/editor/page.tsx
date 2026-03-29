import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { EditorWorkspace } from "@/components/editor-workspace";
import { getCaller } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Editor | Blogs",
  description: "Local-first draft composition for the no-auth phase.",
};

export default async function EditorPage() {
  const caller = await getCaller();
  const editor = await caller.content.editorBootstrap();

  return (
    <AppShell tone="warm">
      <EditorWorkspace editor={editor} />
    </AppShell>
  );
}
