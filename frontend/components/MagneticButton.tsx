"use client";

import { useRef, useState, useCallback, type ReactNode, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  magnetic?: boolean;
}

export default function MagneticButton({
  children,
  className,
  variant = "primary",
  size = "md",
  magnetic = true,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const rippleId = useRef(0);

  // Direct DOM manipulation — no React state, no re-render
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!magnetic || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      ref.current.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    },
    [magnetic],
  );

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = "";
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = rippleId.current++;
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  const variantStyles = {
    primary:
      "bg-cyan text-black font-semibold hover:shadow-[0_0_20px_#00f5ff66] active:scale-[0.97] btn-idle-pulse",
    secondary:
      "border border-white/20 text-foreground hover:border-cyan/50 hover:text-cyan active:scale-[0.97]",
    ghost:
      "text-muted hover:text-foreground hover:bg-white/5",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full transition-colors duration-200 tap-splash",
        variantStyles[variant],
        sizeStyles[size],
        "cursor-pointer",
        className,
      )}
      style={{ transition: "transform 0.15s ease-out" }}
      {...props}
    >
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30 animate-[ripple_0.6s_ease-out]"
          style={{
            left: r.x - 8,
            top: r.y - 8,
            width: 16,
            height: 16,
          }}
        />
      ))}
    </button>
  );
}
