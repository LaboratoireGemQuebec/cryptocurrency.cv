import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  /** Show the full wordmark (true) or just the CV icon (false). */
  showText?: boolean;
  className?: string;
}

/**
 * CryptoVision brand logo — "cryptoVision" wordmark with oversized serif V.
 *
 * Icon mode: stylized V on accent-colored rounded square.
 * Text mode: "crypto" + oversized "V" + "ision" wordmark.
 *
 * Used in Header, Footer, and anywhere the brand mark is needed.
 */
export default function Logo({ size = "md", showText = true, className }: LogoProps) {
  const cfg = {
    sm: { icon: 24, wordH: 20, textSm: "text-[13px]", textLg: "text-[22px]" },
    md: { icon: 28, wordH: 26, textSm: "text-[16px]", textLg: "text-[28px]" },
    lg: { icon: 36, wordH: 34, textSm: "text-[20px]", textLg: "text-[36px]" },
  }[size];

  if (!showText) {
    /* Icon‑only — stylised "V" on accent rounded square */
    return (
      <span className={cn("inline-flex items-center", className)}>
        <svg
          width={cfg.icon}
          height={cfg.icon}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="CryptoVision"
          className="shrink-0"
        >
          <rect width="32" height="32" rx="7" fill="var(--color-accent)" />
          {/* Serif V with top terminals */}
          <path
            d="M9 8h4.5l.5 1-3.5 14.5h-1L9 8Zm14 0h-4.5l-.5 1 3.5 14.5h1L23 8Z"
            fill="white"
          />
          <rect x="7" y="8" width="8" height="1.2" rx=".6" fill="white" />
          <rect x="17" y="8" width="8" height="1.2" rx=".6" fill="white" />
        </svg>
      </span>
    );
  }

  /* Full wordmark — "crypto" + oversized V + "ision" */
  return (
    <span className={cn("inline-flex items-baseline", className)}>
      <span
        className={cn(
          "tracking-tight",
          cfg.textSm,
        )}
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        <span className="text-[var(--color-text-primary)]">crypto</span>
      </span>
      <span
        className={cn(
          "font-bold leading-none -mx-[1px]",
          cfg.textLg,
        )}
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        <span className="text-[var(--color-text-primary)]">V</span>
      </span>
      <span
        className={cn(
          "tracking-tight",
          cfg.textSm,
        )}
        style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        <span className="text-[var(--color-text-primary)]">ision</span>
      </span>
    </span>
  );
}
