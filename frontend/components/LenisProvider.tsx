"use client";

import { type ReactNode } from "react";

/**
 * No-op wrapper — Lenis removed to fix scroll jank.
 * Native `scroll-behavior: smooth` handles smooth scrolling
 * without blocking the main thread with a continuous rAF loop.
 * Modern browsers (Chrome 120+, Edge, Firefox) scroll entirely on
 * the compositor thread — Lenis forced everything back to JS.
 */
export default function LenisProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
