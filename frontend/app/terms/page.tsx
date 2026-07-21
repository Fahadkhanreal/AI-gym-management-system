"use client";

import Link from "next/link";
import { useGym } from "@/lib/gym-context";
import { GymProvider } from "@/lib/gym-context";

function TermsContent() {
  const { settings } = useGym();
  const gymName = settings.gym_name || "TitanForge";
  const email = `hello@${gymName.toLowerCase().replace(/\s+/g, "")}.pk`;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold font-heading">
              <span className="text-cyan">{gymName}</span>
            </span>
          </Link>
          <Link href="/" className="text-sm text-muted hover:text-cyan transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">Terms of Service</h1>
        <p className="text-sm text-muted mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-sm sm:text-base text-muted leading-relaxed">
          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">1. Membership</h2>
            <p>{gymName} offers monthly, quarterly, and yearly membership plans. All payments are processed upfront at the start of each billing cycle. Memberships auto-renew unless cancelled as per our cancellation policy. Refunds are not provided after 7 days of purchase.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">2. Free Trial</h2>
            <p>We offer a 7-day free trial for new members. During the trial period, access to certain premium features and classes may be limited. At the end of the trial, membership will auto-convert to a paid plan unless cancelled beforehand.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">3. Cancellation</h2>
            <p>A 30-day written notice is required for membership cancellation. No mid-cycle refunds will be processed. Cancellation requests can be submitted via email or in person at the front desk.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">4. Code of Conduct</h2>
            <p>All members must adhere to our code of conduct. This includes refraining from harassment, use of drugs or alcohol on premises, wearing appropriate gym attire, and following equipment usage guidelines. Violation may result in membership termination without refund.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">5. Liability Waiver</h2>
            <p>{gymName} is not responsible for personal injuries, lost items, or accidents that occur on the premises. Members use the facilities at their own risk. It is recommended to consult a physician before beginning any fitness program.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">6. Personal Training</h2>
            <p>Personal training sessions are subject to separate terms agreed upon with the trainer. A 24-hour cancellation policy applies to all personal training sessions. Late cancellations or no-shows will be charged the full session fee.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">7. Photo & Video Policy</h2>
            <p>{gymName} may capture photos and videos within the facility for marketing and promotional purposes. Members who do not wish to appear may opt out by notifying the front desk in writing.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">8. Membership Freeze</h2>
            <p>Members may freeze their membership for medical reasons with a valid doctor's note. Freeze periods are limited to a maximum of 3 months. Non-medical freezes are not permitted.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">9. Changes to Terms</h2>
            <p>We reserve the right to modify these terms at any time. Members will be notified of material changes via email. Continued use of the facility after changes constitutes acceptance of the updated terms.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">10. Contact</h2>
            <p>For questions regarding these terms, please contact us at <span className="text-cyan">{email}</span>.</p>
          </section>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 py-6 text-center text-xs text-muted">
        <p>&copy; {new Date().getFullYear()} {gymName}. All rights reserved.</p>
      </div>
    </div>
  );
}

export default function TermsPage() {
  return (
    <GymProvider>
      <TermsContent />
    </GymProvider>
  );
}
