"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useToast } from "@/components/Toast";

/* ───────── Types ───────── */

export interface Alert {
  id: string;
  type: "price_above" | "price_below" | "percent_change";
  coinId: string;
  coinName: string;
  target: number;
  enabled: boolean;
  createdAt: string;
}

export interface TriggeredAlert extends Alert {
  triggeredAt: string;
  currentPrice: number;
}

interface AlertsContextType {
  alerts: Alert[];
  addAlert: (config: Omit<Alert, "id" | "createdAt">) => void;
  removeAlert: (id: string) => void;
  updateAlert: (id: string, updates: Partial<Alert>) => void;
  triggered: TriggeredAlert[];
  clearTriggered: () => void;
}

const AlertsContext = createContext<AlertsContextType>({
  alerts: [],
  addAlert: () => {},
  removeAlert: () => {},
  updateAlert: () => {},
  triggered: [],
  clearTriggered: () => {},
});

export function useAlerts() {
  return useContext(AlertsContext);
}

/* ───────── Constants ───────── */

const STORAGE_KEY = "fcn-alerts";
const TRIGGERED_KEY = "fcn-alerts-triggered";
const MAX_ALERTS = 20;
const POLL_INTERVAL = 60_000;

/* ───────── Helpers ───────── */

function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* quota exceeded — silently ignore */
  }
}

/* ───────── Provider ───────── */

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>(() =>
    loadFromStorage<Alert[]>(STORAGE_KEY, []),
  );
  const [triggered, setTriggered] = useState<TriggeredAlert[]>(() =>
    loadFromStorage<TriggeredAlert[]>(TRIGGERED_KEY, []),
  );
  const { addToast } = useToast();
  const alertsRef = useRef(alerts);
  alertsRef.current = alerts;

  /* Persist alerts */
  useEffect(() => {
    saveToStorage(STORAGE_KEY, alerts);
  }, [alerts]);

  /* Persist triggered */
  useEffect(() => {
    saveToStorage(TRIGGERED_KEY, triggered);
  }, [triggered]);

  /* ── Mutators ── */

  const addAlert = useCallback(
    (config: Omit<Alert, "id" | "createdAt">) => {
      setAlerts((prev) => {
        if (prev.length >= MAX_ALERTS) return prev;
        const alert: Alert = {
          ...config,
          id: crypto.randomUUID?.() ?? Math.random().toString(36).slice(2),
          createdAt: new Date().toISOString(),
        };
        return [...prev, alert];
      });
    },
    [],
  );

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const updateAlert = useCallback((id: string, updates: Partial<Alert>) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    );
  }, []);

  const clearTriggered = useCallback(() => {
    setTriggered([]);
  }, []);

  /* ── Background polling ── */

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    async function check() {
      const current = alertsRef.current;
      const enabled = current.filter((a) => a.enabled);
      if (enabled.length === 0) return;

      const coinIds = [...new Set(enabled.map((a) => a.coinId))];

      try {
        const res = await fetch(`/api/prices?coins=${coinIds.join(",")}`);
        if (!res.ok) return;
        const data: Record<
          string,
          { usd?: number; usd_24h_change?: number }
        > = await res.json();

        const nowTriggered: TriggeredAlert[] = [];

        for (const alert of enabled) {
          const coin = data[alert.coinId];
          if (!coin?.usd) continue;

          let triggered = false;
          if (alert.type === "price_above" && coin.usd >= alert.target) {
            triggered = true;
          } else if (alert.type === "price_below" && coin.usd <= alert.target) {
            triggered = true;
          } else if (
            alert.type === "percent_change" &&
            coin.usd_24h_change != null &&
            Math.abs(coin.usd_24h_change) >= alert.target
          ) {
            triggered = true;
          }

          if (triggered) {
            nowTriggered.push({
              ...alert,
              triggeredAt: new Date().toISOString(),
              currentPrice: coin.usd,
            });
          }
        }

        if (nowTriggered.length > 0) {
          /* Disable triggered alerts to prevent re-firing */
          setAlerts((prev) =>
            prev.map((a) =>
              nowTriggered.some((t) => t.id === a.id)
                ? { ...a, enabled: false }
                : a,
            ),
          );

          setTriggered((prev) => [...nowTriggered, ...prev].slice(0, 50));

          for (const t of nowTriggered) {
            const label =
              t.type === "price_above"
                ? `above $${t.target.toLocaleString()}`
                : t.type === "price_below"
                  ? `below $${t.target.toLocaleString()}`
                  : `${t.target}% change`;

            const msg = `🔔 ${t.coinName} hit ${label} — now $${t.currentPrice.toLocaleString()}`;
            addToast(msg, "success");

            /* Browser notification */
            if (
              typeof Notification !== "undefined" &&
              Notification.permission === "granted"
            ) {
              try {
                new Notification("Price Alert", { body: msg });
              } catch {
                /* ignore */
              }
            }
          }
        }
      } catch {
        /* network error — silently retry next tick */
      }
    }

    check();
    timer = setInterval(check, POLL_INTERVAL);
    return () => clearInterval(timer);
  }, [addToast]);

  return (
    <AlertsContext
      value={{ alerts, addAlert, removeAlert, updateAlert, triggered, clearTriggered }}
    >
      {children}
    </AlertsContext>
  );
}
