"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

function highlightSyntax(code: string, language: string): string {
  let highlighted = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  if (language === "bash" || language === "shell") {
    // Comments
    highlighted = highlighted.replace(
      /(#[^\n]*)/g,
      '<span class="text-gray-500">$1</span>'
    );
    // Strings
    highlighted = highlighted.replace(
      /(&quot;[^&]*?&quot;|"[^"]*?")/g,
      '<span class="text-green-400">$1</span>'
    );
    // Commands at start
    highlighted = highlighted.replace(
      /^(curl|pip|npm|pnpm|bun|go|composer|npx|bunx)\b/gm,
      '<span class="text-cyan-400">$1</span>'
    );
    // Flags
    highlighted = highlighted.replace(
      /(\s)(--?\w[\w-]*)/g,
      '$1<span class="text-yellow-400">$2</span>'
    );
  } else if (language === "python") {
    // Comments
    highlighted = highlighted.replace(
      /(#[^\n]*)/g,
      '<span class="text-gray-500">$1</span>'
    );
    // Strings
    highlighted = highlighted.replace(
      /(f?&quot;[^&]*?&quot;|f?"[^"]*?"|'[^']*?')/g,
      '<span class="text-green-400">$1</span>'
    );
    // Keywords
    highlighted = highlighted.replace(
      /\b(import|from|def|class|return|if|else|elif|for|while|in|as|with|try|except|raise|print|True|False|None)\b/g,
      '<span class="text-purple-400">$1</span>'
    );
    // Functions
    highlighted = highlighted.replace(
      /\b(\w+)\(/g,
      '<span class="text-blue-400">$1</span>('
    );
  } else if (language === "javascript" || language === "typescript" || language === "js" || language === "ts") {
    // Comments
    highlighted = highlighted.replace(
      /(\/\/[^\n]*)/g,
      '<span class="text-gray-500">$1</span>'
    );
    // Strings (template literals and regular)
    highlighted = highlighted.replace(
      /(`[^`]*`|&quot;[^&]*?&quot;|"[^"]*?"|'[^']*?')/g,
      '<span class="text-green-400">$1</span>'
    );
    // Keywords
    highlighted = highlighted.replace(
      /\b(const|let|var|function|async|await|return|import|from|export|default|if|else|for|while|class|new|try|catch|throw|typeof|instanceof)\b/g,
      '<span class="text-purple-400">$1</span>'
    );
    // Functions
    highlighted = highlighted.replace(
      /\b(\w+)\(/g,
      '<span class="text-blue-400">$1</span>('
    );
  } else if (language === "go") {
    // Comments
    highlighted = highlighted.replace(
      /(\/\/[^\n]*)/g,
      '<span class="text-gray-500">$1</span>'
    );
    // Strings
    highlighted = highlighted.replace(
      /(&quot;[^&]*?&quot;|"[^"]*?")/g,
      '<span class="text-green-400">$1</span>'
    );
    // Keywords
    highlighted = highlighted.replace(
      /\b(package|import|func|var|const|type|struct|interface|return|if|else|for|range|defer|go|chan|select|case|switch|break|continue|nil|err)\b/g,
      '<span class="text-purple-400">$1</span>'
    );
    highlighted = highlighted.replace(
      /\b(fmt|http|json|ioutil|log|os|strings|io)\b/g,
      '<span class="text-cyan-400">$1</span>'
    );
  } else if (language === "php") {
    // Comments
    highlighted = highlighted.replace(
      /(\/\/[^\n]*)/g,
      '<span class="text-gray-500">$1</span>'
    );
    // Variables
    highlighted = highlighted.replace(
      /(\$\w+)/g,
      '<span class="text-orange-400">$1</span>'
    );
    // Strings
    highlighted = highlighted.replace(
      /(&quot;[^&]*?&quot;|'[^']*?')/g,
      '<span class="text-green-400">$1</span>'
    );
    // Keywords
    highlighted = highlighted.replace(
      /\b(use|function|return|echo|if|else|foreach|while|class|new|require|include|namespace|public|private|protected|static)\b/g,
      '<span class="text-purple-400">$1</span>'
    );
    // PHP tags
    highlighted = highlighted.replace(
      /(&lt;\?php)/g,
      '<span class="text-red-400">$1</span>'
    );
  } else if (language === "json") {
    // Keys
    highlighted = highlighted.replace(
      /(&quot;[^&]*?&quot;)(\s*:)/g,
      '<span class="text-cyan-400">$1</span>$2'
    );
    // String values
    highlighted = highlighted.replace(
      /(:\s*)(&quot;[^&]*?&quot;)/g,
      '$1<span class="text-green-400">$2</span>'
    );
    // Numbers
    highlighted = highlighted.replace(
      /:\s*(\d+\.?\d*)/g,
      ': <span class="text-orange-400">$1</span>'
    );
    // Booleans/null
    highlighted = highlighted.replace(
      /\b(true|false|null)\b/g,
      '<span class="text-purple-400">$1</span>'
    );
  }

  return highlighted;
}

export default function CodeBlock({
  code,
  language = "bash",
  className,
  showLineNumbers = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement("textarea");
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  const lines = code.split("\n");

  return (
    <div
      className={cn(
        "group relative rounded-lg bg-[#0d1117] border border-[#30363d] overflow-hidden",
        className
      )}
    >
      {/* Language label + Copy button */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#30363d]">
        <span className="text-xs font-mono text-gray-500 uppercase">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-gray-400 hover:text-white hover:bg-[#30363d] transition-colors cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-400"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code content */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className="font-mono text-gray-300">
          {showLineNumbers
            ? lines.map((line, i) => (
                <span key={i} className="table-row">
                  <span className="table-cell pr-4 text-right text-gray-600 select-none w-8">
                    {i + 1}
                  </span>
                  <span
                    className="table-cell"
                    dangerouslySetInnerHTML={{
                      __html: highlightSyntax(line, language),
                    }}
                  />
                  {"\n"}
                </span>
              ))
            : lines.map((line, i) => (
                <span key={i}>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: highlightSyntax(line, language),
                    }}
                  />
                  {i < lines.length - 1 ? "\n" : ""}
                </span>
              ))}
        </code>
      </pre>
    </div>
  );
}
