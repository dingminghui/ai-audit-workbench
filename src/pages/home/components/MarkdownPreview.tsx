import { normalizeExpandedMarkdown } from "@/pages/home/homeUtils";
import type { ComponentProps, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownPreview({ markdown }: { markdown: string }) {
  return (
    <div className="space-y-4 text-slate-600">
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {normalizeExpandedMarkdown(markdown)}
      </ReactMarkdown>
    </div>
  );
}

const markdownComponents = {
  h1: createMarkdownHeading("h1", "audit-display text-lg text-slate-900"),
  h2: createMarkdownHeading("h2", "audit-display text-base text-slate-900"),
  h3: createMarkdownHeading("h3", "text-sm font-semibold text-slate-900"),
  p: ({ children }: ComponentProps<"p">) => (
    <p className="text-[13px] leading-6 text-slate-600">{children}</p>
  ),
  ul: ({ children }: ComponentProps<"ul">) => <ul className="space-y-1.5 pl-5">{children}</ul>,
  ol: ({ children }: ComponentProps<"ol">) => <ol className="space-y-1.5 pl-5">{children}</ol>,
  li: ({ children }: ComponentProps<"li">) => <li className="text-[13px] leading-6">{children}</li>,
  blockquote: ({ children }: ComponentProps<"blockquote">) => (
    <blockquote className="rounded-[20px] border border-slate-200 bg-[#f7f2ec] px-4 py-3 italic text-slate-600">
      {children}
    </blockquote>
  ),
  table: ({ children }: ComponentProps<"table">) => (
    <div className="overflow-x-auto rounded-[18px] border border-slate-200 bg-white/80">
      <table className="min-w-full border-collapse text-left">{children}</table>
    </div>
  ),
  thead: ({ children }: ComponentProps<"thead">) => (
    <thead className="bg-[#f5efe8]">{children}</thead>
  ),
  tbody: ({ children }: ComponentProps<"tbody">) => <tbody>{children}</tbody>,
  th: ({ children }: ComponentProps<"th">) => (
    <th className="border-slate-100 border-b px-3 py-2 text-[11px] font-semibold tracking-[0.12em] text-slate-500 uppercase">
      {children}
    </th>
  ),
  td: ({ children }: ComponentProps<"td">) => (
    <td className="border-slate-100 border-b px-3 py-2 text-[13px] text-slate-600">{children}</td>
  ),
  code: ({ children }: ComponentProps<"code">) => (
    <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-slate-700">
      {children}
    </code>
  ),
  pre: ({ children }: ComponentProps<"pre">) => (
    <pre className="overflow-x-auto rounded-2xl bg-[#102131] px-4 py-3 text-white">{children}</pre>
  ),
};

function createMarkdownHeading(tag: "h1" | "h2" | "h3", className: string) {
  const MarkdownHeading = ({ children }: { children?: ReactNode }) => {
    const Tag = tag;
    return <Tag className={className}>{children}</Tag>;
  };

  MarkdownHeading.displayName = `Markdown${tag.toUpperCase()}`;
  return MarkdownHeading;
}
