import type { Metadata } from "next";
import { AppShell } from "@/components/app-shell";
import { EditorWorkspace } from "@/components/editor-workspace";
import { getCaller } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Editor | Blog",
  description: "Write and preview your content.",
};

export default async function EditorPage() {
  const caller = await getCaller();
  const editor = await caller.content.editorBootstrap();

  return (
    <AppShell>
      <EditorWorkspace editor={editor} />
    </AppShell>
  );
}
