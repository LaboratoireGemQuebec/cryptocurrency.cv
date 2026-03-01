"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { WifiOff, Wifi } from "lucide-react";

type Status = "online" | "offline" | "back-online";

export function OfflineIndicator() {
  const [status, setStatus] = useState<Status>("online");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (!navigator.onLine) setStatus("offline");

    const goOffline = () => setStatus("offline");
    const goOnline = () => {
      setStatus("back-online");
      const t = setTimeout(() => setStatus("online"), 3000);
      return () => clearTimeout(t);
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (status === "online") return null;

  const isBackOnline = status === "back-online";

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 px-4 py-1.5 text-center text-sm font-medium transition-colors duration-300",
        isBackOnline
          ? "bg-green-500 text-white"
          : "bg-amber-500 text-amber-950"
      )}
    >
      {isBackOnline ? (
        <>
          <Wifi className="size-4" aria-hidden="true" />
          Back online!
        </>
      ) : (
        <>
          <WifiOff className="size-4" aria-hidden="true" />
          You are offline. Some features may be limited.
        </>
      )}
    </div>
  );
}
