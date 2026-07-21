"use client";

import { useState, useEffect, useRef } from "react";

/**
 * Scroll progress — uses a single rAF to batch updates.
 * Only sets state when value actually changes to avoid wasted re-renders.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const lastRef = useRef(0);

  useEffect(() => {
    let rafId = 0;

    const handleScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const next = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
        // Only update if changed — prevents wasted re-renders
        if (Math.abs(next - lastRef.current) > 0.5) {
          lastRef.current = next;
          setProgress(next);
        }
        rafId = 0;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return progress;
}
