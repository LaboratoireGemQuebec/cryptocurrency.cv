import { setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { generateSEOMetadata } from "@/lib/seo";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return generateSEOMetadata({
    title: "About Free Crypto News",
    description:
      "Free crypto news API aggregating real-time headlines from 300+ trusted sources. No API key required. Open source and community-driven.",
    path: "/about",
    locale,
    tags: ["about", "crypto news API", "free API", "cryptocurrency news aggregator", "open source"],
  });
}

const stats = [
  { value: "300+", label: "Sources" },
  { value: "10K+", label: "Articles/Day" },
  { value: "100+", label: "Languages" },
  { value: "0", label: "API Keys Required" },
];

const features = [
  {
    icon: "⚡",
    title: "Real-Time Aggregation",
    description:
      "Headlines from 300+ trusted sources updated every 5 minutes. CoinDesk, The Block, Bloomberg, Reuters, CoinTelegraph, and more.",
  },
  {
    icon: "🤖",
    title: "AI Analysis",
    description:
      "AI-powered sentiment analysis, topic classification, and smart summaries. ChatGPT plugin and Claude MCP server included.",
  },
  {
    icon: "🔧",
    title: "Open API",
    description:
      "RESTful JSON API, RSS/Atom feeds, WebSocket streams, and SDKs for Python, TypeScript, Go, React, and PHP. No API key needed.",
  },
];

const techStack = ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="container-main py-10">
        {/* Hero */}
        <section className="text-center mb-16 pt-6">
          <Badge className="mb-4">Open Source</Badge>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-[var(--color-text-primary)] leading-tight">
            Real-time crypto news for everyone.
            <br />
            <span className="text-[var(--color-accent)]">Free. Forever.</span>
          </h1>
          <p className="text-lg md:text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto mb-8">
            The only 100% free crypto news aggregator API. No API keys, no rate
            limits, no hidden costs. Aggregating headlines from 300+ trusted
            sources — open source and community-driven.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="primary" size="lg" asChild>
              <Link href="/developers">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/nirholas/free-crypto-news"
                target="_blank"
                rel="noopener noreferrer"
              >
                ⭐ Star on GitHub
              </a>
            </Button>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-6 text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-[var(--color-accent)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--color-text-secondary)] font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-16">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-center mb-3 text-[var(--color-text-primary)]">
            What We Do
          </h2>
          <p className="text-[var(--color-text-secondary)] text-center max-w-2xl mx-auto mb-10">
            We aggregate, analyze, and deliver cryptocurrency news at scale — so
            you can focus on building.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title}>
                <CardContent className="p-6">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-bold text-lg mb-2 text-[var(--color-text-primary)]">
                    {f.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Source */}
        <section className="mb-16">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] p-8 md:p-12 text-center">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-[var(--color-text-primary)]">
              Open Source &amp; Community-Driven
            </h2>
            <p className="text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-6 leading-relaxed">
              Free Crypto News is fully open source under the MIT license. Inspect
              the code, self-host your own instance, or contribute new features.
              We welcome pull requests, translations, and community feedback.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="primary" asChild>
                <a
                  href="https://github.com/nirholas/free-crypto-news"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="https://github.com/nirholas/free-crypto-news/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Report an Issue
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Team / Community */}
        <section className="mb-16 max-w-3xl mx-auto text-center">
          <h2 className="font-serif text-2xl md:text-3xl font-bold mb-4 text-[var(--color-text-primary)]">
            Built by the Community
          </h2>
          <p className="text-[var(--color-text-secondary)] mb-6 leading-relaxed">
            Free Crypto News is maintained by a global community of open source
            contributors. Whether you&apos;re fixing a bug, adding a new source,
            translating the interface, or improving documentation — every
            contribution matters.
          </p>
          <Button variant="outline" asChild>
            <a
              href="https://github.com/nirholas/free-crypto-news/graphs/contributors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meet Our Contributors
            </a>
          </Button>
        </section>

        {/* Tech Stack */}
        <section className="mb-10 text-center">
          <h2 className="font-serif text-2xl font-bold mb-6 text-[var(--color-text-primary)]">
            Tech Stack
          </h2>
          <div className="flex gap-3 justify-center flex-wrap">
            {techStack.map((tech) => (
              <Badge key={tech} className="text-sm px-3 py-1">
                {tech}
              </Badge>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
