"use client";

import { Streamdown } from "streamdown";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={className}>
      <Streamdown>{content}</Streamdown>
    </div>
  );
}
