"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface FearGreedGaugeProps {
  value: number;
  label: string;
  className?: string;
}

function getColor(value: number): string {
  if (value <= 25) return "#ea3943";
  if (value <= 45) return "#ea8c00";
  if (value <= 55) return "#f5d100";
  if (value <= 75) return "#16c784";
  return "#0d8a5e";
}

function getLabelColor(value: number): string {
  if (value <= 25) return "text-red-500";
  if (value <= 45) return "text-orange-500";
  if (value <= 55) return "text-yellow-500";
  if (value <= 75) return "text-green-500";
  return "text-emerald-600";
}

export default function FearGreedGauge({
  value,
  label,
  className,
}: FearGreedGaugeProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const duration = 1200;
    const start = performance.now();
    const target = Math.max(0, Math.min(100, value));

    function animate(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedValue(eased * target);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]);

  // Gauge arc: from 180° (left) to 0° (right), going clockwise
  const radius = 100;
  const cx = 120;
  const cy = 120;
  const strokeWidth = 20;

  // Generate gradient arc segments
  const segments = [
    { start: 0, end: 25, color: "#ea3943" },
    { start: 25, end: 45, color: "#ea8c00" },
    { start: 45, end: 55, color: "#f5d100" },
    { start: 55, end: 75, color: "#16c784" },
    { start: 75, end: 100, color: "#0d8a5e" },
  ];

  function valueToAngle(v: number): number {
    return Math.PI - (v / 100) * Math.PI;
  }

  function polarToCartesian(angle: number): { x: number; y: number } {
    return {
      x: cx + radius * Math.cos(angle),
      y: cy - radius * Math.sin(angle),
    };
  }

  function arcPath(startVal: number, endVal: number): string {
    const startAngle = valueToAngle(startVal);
    const endAngle = valueToAngle(endVal);
    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArc = Math.abs(startAngle - endAngle) > Math.PI ? 1 : 0;
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y}`;
  }

  // Needle
  const needleAngle = valueToAngle(animatedValue);
  const needleLength = radius - 15;
  const needleTip = {
    x: cx + needleLength * Math.cos(needleAngle),
    y: cy - needleLength * Math.sin(needleAngle),
  };

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <svg
        viewBox="0 0 240 140"
        className="w-full max-w-sm"
        aria-label={`Fear and Greed Index: ${Math.round(animatedValue)} - ${label}`}
      >
        {/* Background arc segments */}
        {segments.map((seg) => (
          <path
            key={seg.start}
            d={arcPath(seg.start, seg.end)}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
            opacity={0.25}
          />
        ))}

        {/* Active arc up to current value */}
        {animatedValue > 0 &&
          segments.map((seg) => {
            const segStart = seg.start;
            const segEnd = Math.min(seg.end, animatedValue);
            if (segStart >= animatedValue) return null;
            return (
              <path
                key={`active-${seg.start}`}
                d={arcPath(segStart, segEnd)}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeLinecap="butt"
              />
            );
          })}

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={needleTip.x}
          y2={needleTip.y}
          stroke={getColor(animatedValue)}
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={getColor(animatedValue)}
        />

        {/* Labels at the ends */}
        <text
          x={cx - radius - 5}
          y={cy + 15}
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-secondary, #888)"
        >
          0
        </text>
        <text
          x={cx + radius + 5}
          y={cy + 15}
          textAnchor="middle"
          fontSize="10"
          fill="var(--color-text-secondary, #888)"
        >
          100
        </text>
      </svg>

      {/* Center number and label */}
      <div className="text-center -mt-4">
        <div
          className="text-5xl font-bold tabular-nums"
          style={{ color: getColor(animatedValue) }}
        >
          {Math.round(animatedValue)}
        </div>
        <div className={cn("text-lg font-semibold mt-1", getLabelColor(value))}>
          {label}
        </div>
      </div>
    </div>
  );
}
