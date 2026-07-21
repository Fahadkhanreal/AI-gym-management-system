"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  target: number;
  suffix?: string;
  className?: string;
}

/**
 * **Zero JS animation** counter.
 * Shows 0 → fades final number in after 1.2s delay (scroll settles first).
 * No setInterval, no rAF, no main-thread blocking.
 */
export default function AnimatedCounter({
  target,
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          // Wait 1.2s for scroll to settle, then show final number
          setTimeout(() => setShow(true), 1200);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      <span
        className="transition-opacity duration-500 ease-out"
        style={{ opacity: show ? 1 : 0 }}
      >
        {show ? target : 0}
      </span>
      {suffix}
    </span>
  );
}
