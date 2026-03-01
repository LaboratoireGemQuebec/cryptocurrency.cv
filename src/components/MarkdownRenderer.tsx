"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * Lightweight regex-based Markdown renderer.
 * Handles: headings, bold, italic, inline code, code blocks,
 * unordered/ordered lists, links, blockquotes, horizontal rules, and paragraphs.
 * No external dependencies.
 */
export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const blocks = parseBlocks(content);

  return (
    <div className={cn("prose-ai space-y-3 text-sm leading-relaxed", className)}>
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────

type MdBlock =
  | { type: "heading"; level: number; text: string }
  | { type: "code"; lang: string; code: string }
  | { type: "blockquote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "hr" }
  | { type: "paragraph"; text: string };

// ── Block Parsing ──────────────────────────────────────────────────

function parseBlocks(raw: string): MdBlock[] {
  const lines = raw.split("\n");
  const blocks: MdBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank lines
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Fenced code block
    const fenceMatch = line.match(/^```(\w*)/);
    if (fenceMatch) {
      const lang = fenceMatch[1] || "";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: "code", lang, code: codeLines.join("\n") });
      continue;
    }

    // Heading
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      blocks.push({
        type: "heading",
        level: headingMatch[1].length,
        text: headingMatch[2],
      });
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line.trim())) {
      blocks.push({ type: "hr" });
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        quoteLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push({ type: "blockquote", text: quoteLines.join("\n") });
      continue;
    }

    // Unordered list
    if (/^[\-\*\+]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[\-\*\+]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[\-\*\+]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Paragraph — collect consecutive non-blank, non-special lines
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].match(/^(#{1,6}\s|```|>\s|[-*+]\s|\d+\.\s|---|\*\*\*|___)/)
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", text: paraLines.join("\n") });
    }
  }

  return blocks;
}

// ── Block Rendering ────────────────────────────────────────────────

function Block({ block }: { block: MdBlock }) {
  switch (block.type) {
    case "heading": {
      const Tag = `h${Math.min(block.level, 6)}` as keyof React.JSX.IntrinsicElements;
      const sizes: Record<number, string> = {
        1: "text-xl font-bold font-serif",
        2: "text-lg font-bold font-serif",
        3: "text-base font-semibold font-serif",
        4: "text-sm font-semibold",
        5: "text-sm font-medium",
        6: "text-xs font-medium uppercase tracking-wide",
      };
      return (
        <Tag className={cn(sizes[block.level] ?? sizes[3], "text-[var(--color-text-primary)]")}>
          <InlineContent text={block.text} />
        </Tag>
      );
    }

    case "code":
      return (
        <pre className="overflow-x-auto rounded-md bg-[var(--color-surface-tertiary)] p-3 text-xs font-mono leading-relaxed">
          <code>{block.code}</code>
        </pre>
      );

    case "blockquote":
      return (
        <blockquote className="border-l-3 border-[var(--color-accent)] pl-4 italic text-[var(--color-text-secondary)]">
          <InlineContent text={block.text} />
        </blockquote>
      );

    case "ul":
      return (
        <ul className="list-disc pl-5 space-y-1">
          {block.items.map((item, i) => (
            <li key={i} className="text-[var(--color-text-primary)]">
              <InlineContent text={item} />
            </li>
          ))}
        </ul>
      );

    case "ol":
      return (
        <ol className="list-decimal pl-5 space-y-1">
          {block.items.map((item, i) => (
            <li key={i} className="text-[var(--color-text-primary)]">
              <InlineContent text={item} />
            </li>
          ))}
        </ol>
      );

    case "hr":
      return <hr className="border-[var(--color-border)]" />;

    case "paragraph":
      return (
        <p className="text-[var(--color-text-primary)]">
          <InlineContent text={block.text} />
        </p>
      );
  }
}

// ── Inline Parsing (bold, italic, code, links) ────────────────────

function InlineContent({ text }: { text: string }) {
  return <>{parseInline(text)}</>;
}

function parseInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Regex matches: inline code, bold, italic, links
  const pattern = /(`[^`]+`)|(\*\*[^*]+\*\*)|(__[^_]+__)|(\*[^*]+\*)|(_[^_]+_)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    // Push text before match
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      // Inline code
      const code = match[1].slice(1, -1);
      nodes.push(
        <code
          key={match.index}
          className="rounded bg-[var(--color-surface-tertiary)] px-1.5 py-0.5 text-xs font-mono"
        >
          {code}
        </code>
      );
    } else if (match[2]) {
      // Bold **text**
      nodes.push(
        <strong key={match.index} className="font-semibold">
          {match[2].slice(2, -2)}
        </strong>
      );
    } else if (match[3]) {
      // Bold __text__
      nodes.push(
        <strong key={match.index} className="font-semibold">
          {match[3].slice(2, -2)}
        </strong>
      );
    } else if (match[4]) {
      // Italic *text*
      nodes.push(
        <em key={match.index}>{match[4].slice(1, -1)}</em>
      );
    } else if (match[5]) {
      // Italic _text_
      nodes.push(
        <em key={match.index}>{match[5].slice(1, -1)}</em>
      );
    } else if (match[6]) {
      // Link [text](url)
      nodes.push(
        <a
          key={match.index}
          href={match[8]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-accent)] underline underline-offset-2 hover:opacity-80"
        >
          {match[7]}
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Push remaining text
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
