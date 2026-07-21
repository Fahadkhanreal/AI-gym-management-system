"use client";

import Link from "next/link";
import { useGym } from "@/lib/gym-context";
import { GymProvider } from "@/lib/gym-context";

function PrivacyContent() {
  const { settings } = useGym();
  const gymName = settings.gym_name || "TitanForge";

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
        <h1 className="font-heading text-3xl sm:text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted mb-8">Last updated: July 2026</p>

        <div className="space-y-8 text-sm sm:text-base text-muted leading-relaxed">
          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
            <p>We collect the following information when you sign up for a membership or use our services:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Full name, email address, and phone number</li>
              <li>Fitness goals, experience level, and health-related information</li>
              <li>Payment details (processed securely through third-party providers)</li>
              <li>Attendance and class booking history</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>To manage your membership and class bookings</li>
              <li>To send you marketing communications (only with your consent)</li>
              <li>To improve our services and facilities</li>
              <li>To respond to your inquiries and support requests</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">3. Data Storage & Security</h2>
            <p>Your data is stored securely on Supabase servers. We implement encryption at rest and in transit. Access to personal data is restricted to authorized personnel only. We follow industry-standard security practices to protect your information.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">4. Third-Party Sharing</h2>
            <p>We do not sell, trade, or rent your personal information to third parties. We may share your data with trusted service providers who assist us in operating our business, including:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Payment processors (for membership billing)</li>
              <li>Email service providers (for transactional and marketing emails)</li>
              <li>WhatsApp API (for communication)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
            <p>We retain your personal data for as long as your membership account is active and for a period of 2 years after cancellation for record-keeping purposes. You may request earlier deletion of your data at any time.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
            <p className="mt-2">To exercise any of these rights, please email us at <span className="text-cyan">hello@{gymName.toLowerCase().replace(/\s+/g, "")}.pk</span>.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">7. Cookies</h2>
            <p>We use only essential cookies necessary for the functioning of our website and admin dashboard. We do not use tracking cookies or third-party advertising cookies. You can control cookie settings through your browser preferences.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">8. Security Measures</h2>
            <p>We implement the following security measures to protect your data: SSL/TLS encryption for all data in transit, encrypted database storage, restricted admin access with authentication, regular security audits, and secure payment processing through third-party providers.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify members of material changes via email. Your continued use of our services after acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="font-heading text-lg sm:text-xl font-semibold text-foreground mb-3">10. Contact Us</h2>
            <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <p className="mt-2">Email: <span className="text-cyan">hello@{gymName.toLowerCase().replace(/\s+/g, "")}.pk</span></p>
            <p>Phone: {settings.phone || "+92 300 1234567"}</p>
            <p>Address: {settings.address || "58-A, Block 6, PECHS, Shahrah-e-Faisal, Karachi"}</p>
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

export default function PrivacyPage() {
  return (
    <GymProvider>
      <PrivacyContent />
    </GymProvider>
  );
}
