"use client";

import { useState, type FormEvent } from "react";
import { Mail, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setMessage("You're subscribed! Check your inbox.");
        setEmail("");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(data.error || "Something went wrong. Try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <section className="border-b border-[var(--color-border)]">
      <div className="container-main py-10">
        <div
          className={cn(
            "relative overflow-hidden rounded-xl p-8 md:p-12",
            "bg-gradient-to-br from-[var(--color-accent)] to-[color-mix(in_srgb,var(--color-accent),#000_30%)]"
          )}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px"
            }} />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-white/20 mb-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-2">
              Stay Updated with Crypto News
            </h2>
            <p className="text-white/80 text-sm md:text-base mb-6">
              Get the latest crypto news, market insights, and analysis delivered to your inbox. Free forever.
            </p>

            {status === "success" ? (
              <div className="flex items-center justify-center gap-2 text-white bg-white/20 rounded-lg py-3 px-6 mx-auto max-w-md">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{message}</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className={cn(
                    "flex-1 h-11 rounded-lg border-0 bg-white/20 px-4 text-white placeholder:text-white/60",
                    "focus:outline-none focus:ring-2 focus:ring-white/50 backdrop-blur-sm"
                  )}
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-11 bg-white text-[var(--color-accent)] hover:bg-white/90 font-semibold shadow-lg"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              </form>
            )}

            {status === "error" && (
              <p className="mt-3 text-sm text-red-200">{message}</p>
            )}

            <p className="mt-4 text-xs text-white/50">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
