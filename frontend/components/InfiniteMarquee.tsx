"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
  children: ReactNode[];
  direction?: "left" | "right";
  speed?: number;
  className?: string;
}

export default function InfiniteMarquee({
  children,
  direction = "left",
  speed = 30,
  className,
}: InfiniteMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [duplicateCount, setDuplicateCount] = useState(2);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Schedule measurement in rAF to avoid forced reflow in same frame
    requestAnimationFrame(() => {
      if (!el.parentElement) return;
      const containerWidth = el.parentElement.offsetWidth;
      const totalChildWidth = el.scrollWidth / (children.length + 2);
      if (totalChildWidth > 0) {
        const needed = Math.ceil(containerWidth / totalChildWidth) + 1;
        setDuplicateCount(Math.max(2, needed));
      }
    });
  }, [children.length]);

  return (
    <div
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div
        ref={containerRef}
        className="flex gap-6"
        style={{
          animation: `marquee-${direction} ${speed}s linear infinite`,
          animationPlayState: isPaused ? "paused" : "running",
          width: "max-content",
        }}
      >
        {/* Duplicate children with unique keys to avoid key conflicts */}
        {Array.from({ length: duplicateCount + 1 }).map((_, blockIdx) =>
          children.map((child, childIdx) => (
            <div key={`block-${blockIdx}-child-${childIdx}`} className="contents">
              {child}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
