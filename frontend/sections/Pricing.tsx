"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import PricingToggle from "@/components/PricingToggle";
import type { BillingCycle } from "@/components/PricingToggle";
import GlassPanel from "@/components/GlassPanel";
import HoverCard3D from "@/components/HoverCard3D";
import MagneticButton from "@/components/MagneticButton";
import { useModal } from "@/components/ModalProvider";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_quarterly: number;
  price_yearly: number;
  features: { text: string; included: boolean }[];
  is_popular: boolean;
  cta_text: string;
}

export default function Pricing() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const { openTrial, openContact } = useModal();

  useEffect(() => {
    fetch("/api/pricing")
      .then(r => r.json())
      .then(data => {
        setPlans(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getPrice = (plan: PricingPlan) => {
    switch (billing) {
      case "monthly": return plan.price_monthly;
      case "quarterly": return plan.price_quarterly;
      case "yearly": return plan.price_yearly;
    }
  };

  const getPeriod = () => {
    switch (billing) {
      case "monthly": return "/month";
      case "quarterly": return "/quarter";
      case "yearly": return "/year";
    }
  };

  if (loading) {
    return (
      <section id="pricing" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6">
        <div className="mx-auto max-w-7xl text-center">
          <div className="size-6 rounded-full border-2 border-cyan border-t-transparent animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (!plans.length) return null;

  return (
    <section id="pricing" className="relative py-20 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-10 sm:mb-12 animate-fade-in-up">
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.2em] text-cyan mb-3 sm:mb-4">
            Membership Plans
          </p>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold">
            Invest In{" "}
            <span className="text-gold">Yourself</span>
          </h2>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-10 sm:mb-12">
          <PricingToggle value={billing} onChange={setBilling} />
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.id} className="flex relative">
              {plan.is_popular && (
                <div className="absolute left-1/2 -translate-x-1/2 z-30" style={{ top: "-14px" }}>
                  <span className="inline-block rounded-full bg-gold whitespace-nowrap px-4 py-1 text-[10px] sm:text-xs font-bold text-black shadow-[0_0_20px_rgba(255,215,0,0.5)]">
                    ★ RECOMMENDED
                  </span>
                </div>
              )}
              <HoverCard3D animatedBorder={plan.is_popular} className="flex-1">
                <div className="relative h-full">
                  <GlassPanel
                    variant={plan.is_popular ? "strong" : "default"}
                    className={`p-6 sm:p-8 h-full ${plan.is_popular ? "border-cyan/30" : ""}`}
                  >
                  <div className="text-center mb-6 sm:mb-8">
                    <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted mb-4 sm:mb-6">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
                        PKR {getPrice(plan).toLocaleString()}
                      </span>
                      <span className="text-xs sm:text-sm text-muted">{getPeriod()}</span>
                    </div>
                  </div>

                  <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                        {f.included ? (
                          <Check size={14} className="mt-0.5 shrink-0 text-cyan sm:size-4" />
                        ) : (
                          <X size={14} className="mt-0.5 shrink-0 text-muted/50 sm:size-4" />
                        )}
                        <span className={f.included ? "text-muted" : "text-muted/50 line-through"}>
                          {f.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <MagneticButton
                    variant={plan.is_popular ? "primary" : "secondary"}
                    className="w-full"
                    onClick={() => plan.name.toLowerCase() === "basic" ? openTrial() : openContact(`Join ${plan.name}`)}
                  >
                    {plan.cta_text}
                  </MagneticButton>
                </GlassPanel>
              </div>
            </HoverCard3D>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
