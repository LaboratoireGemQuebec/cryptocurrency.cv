import {
  BarChart3,
  Layers,
  Briefcase,
  Fuel,
  Calculator,
  Code2,
  ArrowRight,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const TOOLS = [
  {
    title: "Markets",
    description: "Real-time prices, charts, and market data for thousands of cryptocurrencies.",
    href: "/markets",
    icon: BarChart3,
  },
  {
    title: "DeFi",
    description: "Track DeFi protocols, TVL, yields, and decentralized exchange volumes.",
    href: "/defi",
    icon: Layers,
  },
  {
    title: "Portfolio",
    description: "Monitor your crypto holdings and track performance over time.",
    href: "/portfolio",
    icon: Briefcase,
  },
  {
    title: "Gas Tracker",
    description: "Live gas fees for Ethereum, BSC, Polygon, and other EVM chains.",
    href: "/gas",
    icon: Fuel,
  },
  {
    title: "Calculator",
    description: "Convert between cryptocurrencies and fiat currencies instantly.",
    href: "/calculator",
    icon: Calculator,
  },
  {
    title: "API Docs",
    description: "Free REST API, RSS feeds, GraphQL, and WebSocket for developers.",
    href: "/developers",
    icon: Code2,
  },
] as const;

export default function ExploreMore() {
  return (
    <section className="container-main py-10 lg:py-14">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold font-serif mb-2">Explore More</h2>
        <p className="text-sm text-[var(--color-text-secondary)] max-w-lg mx-auto">
          Powerful tools and data to help you navigate the crypto market.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={cn(
                "group flex items-start gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5",
                "hover:shadow-md hover:border-[var(--color-accent)] transition-all"
              )}
            >
              <div className="shrink-0 flex items-center justify-center h-10 w-10 rounded-lg bg-[var(--color-surface-secondary)] text-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-white transition-colors">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[var(--color-text-primary)]">
                    {tool.title}
                  </h3>
                  <ArrowRight className="h-4 w-4 text-[var(--color-text-tertiary)] group-hover:text-[var(--color-accent)] transition-colors" />
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-secondary)] line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
