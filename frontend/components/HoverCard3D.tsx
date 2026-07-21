"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface HoverCard3DProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  animatedBorder?: boolean;
}

/**
 * Pure CSS hover card — no Framer Motion, no JS main thread work.
 * Uses CSS transition for scale-on-hover, avoiding rAF/spring physics.
 */
export default function HoverCard3D({
  children,
  className,
  animatedBorder = false,
}: HoverCard3DProps) {
  return (
    <div
      className={cn(
        "group relative cursor-default rounded-2xl transition-transform duration-300 ease-out",
        "hover:scale-[1.02]",
        "card-press tap-splash",
        animatedBorder && "border-glow",
        className,
      )}
    >
      {children}
      {/* Glow overlay on hover — pure CSS */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(0, 245, 255, 0.12), transparent 70%)",
        }}
      />
    </div>
  );
}
