"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong";
}

export default function GlassPanel({
  children,
  className,
  variant = "default",
}: GlassPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl tap-splash",
        variant === "strong" ? "glass-strong" : "glass",
        className,
      )}
    >
      {children}
    </div>
  );
}
