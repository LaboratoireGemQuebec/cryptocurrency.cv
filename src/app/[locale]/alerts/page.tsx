"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAlerts, type Alert } from "@/components/alerts";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import {
  Bell,
  BellOff,
  Plus,
  Trash2,
  TrendingUp,
  TrendingDown,
  Percent,
  AlertTriangle,
  Clock,
} from "lucide-react";

/* ───────── Coin options ───────── */

const COIN_OPTIONS = [
  { id: "bitcoin", name: "Bitcoin" },
  { id: "ethereum", name: "Ethereum" },
  { id: "solana", name: "Solana" },
  { id: "cardano", name: "Cardano" },
  { id: "dogecoin", name: "Dogecoin" },
  { id: "polkadot", name: "Polkadot" },
  { id: "avalanche-2", name: "Avalanche" },
  { id: "chainlink", name: "Chainlink" },
  { id: "ripple", name: "XRP" },
  { id: "matic-network", name: "Polygon" },
] as const;

const ALERT_TYPE_OPTIONS: { value: Alert["type"]; label: string; icon: typeof TrendingUp }[] = [
  { value: "price_above", label: "Price Above", icon: TrendingUp },
  { value: "price_below", label: "Price Below", icon: TrendingDown },
  { value: "percent_change", label: "% Change (24h)", icon: Percent },
];

/* ───────── Page ───────── */

export default function AlertsPage() {
  const { alerts, addAlert, removeAlert, updateAlert, triggered, clearTriggered } = useAlerts();

  /* Form state */
  const [coinId, setCoinId] = useState(COIN_OPTIONS[0].id);
  const [alertType, setAlertType] = useState<Alert["type"]>("price_above");
  const [target, setTarget] = useState("");

  const handleCreate = () => {
    const numTarget = Number(target);
    if (!numTarget || numTarget <= 0) return;
    const coin = COIN_OPTIONS.find((c) => c.id === coinId);
    if (!coin) return;
    addAlert({
      type: alertType,
      coinId: coin.id,
      coinName: coin.name,
      target: numTarget,
      enabled: true,
    });
    setTarget("");
  };

  const formatType = (type: Alert["type"]) => {
    switch (type) {
      case "price_above":
        return "Above";
      case "price_below":
        return "Below";
      case "percent_change":
        return "% Change";
    }
  };

  const typeIcon = (type: Alert["type"]) => {
    switch (type) {
      case "price_above":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "price_below":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      case "percent_change":
        return <Percent className="h-4 w-4 text-[var(--color-accent)]" />;
    }
  };

  return (
    <>
      <Header />
      <main className="container-main py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-2 flex items-center gap-3">
            <Bell className="h-8 w-8 text-[var(--color-accent)]" />
            Price Alerts
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            Create price alerts and get notified when your targets are hit. Alerts are checked every
            60 seconds.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column – Create + Triggered */}
          <div className="space-y-6">
            {/* Create Alert */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Plus className="h-5 w-5" />
                  Create Alert
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coin select */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1 block">
                    Coin
                  </label>
                  <select
                    value={coinId}
                    onChange={(e) => setCoinId(e.target.value)}
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  >
                    {COIN_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Type select */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1 block">
                    Alert Type
                  </label>
                  <select
                    value={alertType}
                    onChange={(e) => setAlertType(e.target.value as Alert["type"])}
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                  >
                    {ALERT_TYPE_OPTIONS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target */}
                <div>
                  <label className="text-sm font-medium text-[var(--color-text-secondary)] mb-1 block">
                    {alertType === "percent_change" ? "Percent (%)" : "Target Price (USD)"}
                  </label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    placeholder={alertType === "percent_change" ? "e.g. 5" : "e.g. 100000"}
                    className="w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreate();
                    }}
                  />
                </div>

                <Button
                  variant="primary"
                  className="w-full"
                  onClick={handleCreate}
                  disabled={!target || Number(target) <= 0 || alerts.length >= 20}
                >
                  {alerts.length >= 20 ? "Max alerts reached (20)" : "Create Alert"}
                </Button>
              </CardContent>
            </Card>

            {/* Triggered History */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5" />
                    Triggered History
                  </CardTitle>
                  {triggered.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearTriggered}>
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {triggered.length === 0 ? (
                  <p className="text-sm text-[var(--color-text-tertiary)] text-center py-4">
                    No triggered alerts yet.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {triggered.slice(0, 20).map((t, i) => (
                      <li
                        key={`${t.id}-${i}`}
                        className="flex items-start gap-3 rounded-md border border-[var(--color-border)] p-3 text-sm"
                      >
                        {typeIcon(t.type)}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-[var(--color-text-primary)]">
                            {t.coinName}{" "}
                            <span className="text-[var(--color-text-secondary)]">
                              {formatType(t.type)} ${t.target.toLocaleString()}
                            </span>
                          </p>
                          <p className="text-xs text-[var(--color-text-tertiary)]">
                            Was ${t.currentPrice.toLocaleString()} —{" "}
                            {new Date(t.triggeredAt).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right column – Active Alerts Table */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  Active Alerts
                  {alerts.length > 0 && (
                    <Badge className="ml-2">{alerts.length}/20</Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Bell className="h-12 w-12 mx-auto text-[var(--color-text-tertiary)]" />
                    <h3 className="font-semibold text-lg text-[var(--color-text-primary)]">
                      No alerts yet
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] max-w-md mx-auto">
                      Price alerts let you know when a cryptocurrency reaches your target price.
                      Create one using the form on the left to get started. Alerts check prices
                      every 60 seconds.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-text-secondary)]">
                          <th className="pb-3 pr-4 font-medium">Coin</th>
                          <th className="pb-3 pr-4 font-medium">Type</th>
                          <th className="pb-3 pr-4 font-medium">Target</th>
                          <th className="pb-3 pr-4 font-medium">Status</th>
                          <th className="pb-3 pr-4 font-medium">Created</th>
                          <th className="pb-3 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {alerts.map((alert) => (
                          <tr
                            key={alert.id}
                            className="border-b border-[var(--color-border)] last:border-0"
                          >
                            <td className="py-3 pr-4 font-medium text-[var(--color-text-primary)]">
                              {alert.coinName}
                            </td>
                            <td className="py-3 pr-4">
                              <span className="inline-flex items-center gap-1.5">
                                {typeIcon(alert.type)}
                                {formatType(alert.type)}
                              </span>
                            </td>
                            <td className="py-3 pr-4 tabular-nums">
                              {alert.type === "percent_change"
                                ? `${alert.target}%`
                                : `$${alert.target.toLocaleString()}`}
                            </td>
                            <td className="py-3 pr-4">
                              <button
                                onClick={() =>
                                  updateAlert(alert.id, { enabled: !alert.enabled })
                                }
                                className={cn(
                                  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
                                  alert.enabled
                                    ? "bg-green-500/10 text-green-500"
                                    : "bg-[var(--color-text-tertiary)]/10 text-[var(--color-text-tertiary)]",
                                )}
                              >
                                {alert.enabled ? (
                                  <Bell className="h-3 w-3" />
                                ) : (
                                  <BellOff className="h-3 w-3" />
                                )}
                                {alert.enabled ? "Active" : "Paused"}
                              </button>
                            </td>
                            <td className="py-3 pr-4 text-[var(--color-text-tertiary)] text-xs">
                              {new Date(alert.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeAlert(alert.id)}
                                aria-label="Delete alert"
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
