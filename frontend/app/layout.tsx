import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { createClient } from "@supabase/supabase-js";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://titanforge.pk";

async function getGymSettings() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data } = await supabase.from("gym_settings").select("*").maybeSingle();
  return data;
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getGymSettings();
  const gymName = settings?.gym_name || "TitanForge";
  const tagline = settings?.tagline || "Premium Fitness";
  const location = "Karachi";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${gymName} ${location} — ${tagline} | Forge Your Legacy`,
      template: `%s | ${gymName} ${location}`,
    },
    description:
      `${location}'s premium gym. 200+ machines, expert trainers, CrossFit, strength training, mobility & more. Start your free trial today at ${gymName} — Forge Your Legacy.`,
    keywords: [
      "gym Karachi", "premium gym Karachi", "best gym in Karachi", gymName,
      "fitness Karachi", "CrossFit Karachi", "strength training Karachi",
      "personal trainer Karachi", "gym near me Karachi", "PECHS gym",
      "weight loss Karachi", "muscle gain Karachi", "boxing Karachi",
      "yoga Karachi", "gym membership Karachi", "free trial gym",
    ],
    authors: [{ name: gymName }],
    creator: gymName,
    publisher: gymName,
    openGraph: {
      title: `${gymName} ${location} — ${tagline}`,
      description:
        `${location}'s premium gym. World-class equipment, expert trainers, 12+ programs. Start your free trial!`,
      url: siteUrl,
      siteName: gymName,
      locale: "en_PK",
      type: "website",
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: `${gymName} ${location} — ${tagline}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${gymName} ${location} — ${tagline}`,
      description:
        `${location}'s premium gym. 200+ machines, expert trainers, 12+ programs. Start your free trial!`,
      images: ["/og-image.svg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: siteUrl,
    },
    category: "fitness",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-PK"
      className={`${spaceGrotesk.variable} ${inter.variable} dark`}
    >
      <body className="min-h-dvh bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
