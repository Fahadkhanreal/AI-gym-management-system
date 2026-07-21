"use client";

import { cn } from "@/lib/utils";

type BillingCycle = "monthly" | "quarterly" | "yearly";

interface PricingToggleProps {
  value: BillingCycle;
  onChange: (value: BillingCycle) => void;
  className?: string;
}

const options: { value: BillingCycle; label: string }[] = [
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

export default function PricingToggle({
  value,
  onChange,
  className,
}: PricingToggleProps) {
  return (
    <div
      className={cn(
        "glass inline-flex rounded-full p-1",
        className,
      )}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "relative cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-colors duration-200",
            value === opt.value
              ? "bg-cyan text-black"
              : "text-muted hover:text-foreground",
          )}
        >
          {opt.label}
          {opt.value === "yearly" && (
            <span className="absolute -top-2 -right-1 text-[10px] text-gold font-semibold">
              Save
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export type { BillingCycle };
