import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

/**
 * Crypto Vision brand logo — geometric "CV" monogram with consistent accent color.
 * Used in Header, Footer, and anywhere the brand mark is needed.
 */
export default function Logo({ size = "md", showText = true, className }: LogoProps) {
  const dimensions = {
    sm: { icon: 24, text: "text-base" },
    md: { icon: 28, text: "text-lg" },
    lg: { icon: 36, text: "text-2xl" },
  }[size];

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <svg
        width={dimensions.icon}
        height={dimensions.icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Background rounded square */}
        <rect width="32" height="32" rx="7" fill="var(--color-accent)" />
        {/* C letter */}
        <path
          d="M13.5 9.5C10.5 9.5 8 12.2 8 16C8 19.8 10.5 22.5 13.5 22.5C15.2 22.5 16.7 21.6 17.6 20.2"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* V letter */}
        <path
          d="M16.5 9.5L20 20.5L23.5 9.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className={cn("font-bold tracking-tight", dimensions.text)}>
          <span className="text-[var(--color-accent)]">Crypto</span>
          <span className="text-[var(--color-text-primary)]"> Vision</span>
        </span>
      )}
    </span>
  );
}
