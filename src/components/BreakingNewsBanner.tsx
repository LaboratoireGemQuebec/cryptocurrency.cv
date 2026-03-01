"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreakingArticle {
  title: string;
  link: string;
}

interface BreakingNewsBannerProps {
  articles: BreakingArticle[];
}

export default function BreakingNewsBanner({ articles }: BreakingNewsBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || articles.length === 0) return null;

  return (
    <div className="relative bg-red-600 text-white overflow-hidden">
      <div className="flex items-center h-10">
        <span className="shrink-0 bg-red-700 px-3 py-1 text-xs font-bold uppercase tracking-wider z-10">
          🔴 Breaking
        </span>
        <div className="flex-1 overflow-hidden">
          <div className="breaking-marquee flex items-center gap-12 whitespace-nowrap">
            {[...articles, ...articles].map((article, i) => (
              <a
                key={`${article.link}-${i}`}
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium hover:underline"
              >
                {article.title}
              </a>
            ))}
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 p-2 hover:bg-red-700 transition-colors z-10 cursor-pointer"
          aria-label="Dismiss breaking news"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <style jsx>{`
        .breaking-marquee {
          animation: breaking-scroll 30s linear infinite;
        }
        .breaking-marquee:hover {
          animation-play-state: paused;
        }
        @keyframes breaking-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
