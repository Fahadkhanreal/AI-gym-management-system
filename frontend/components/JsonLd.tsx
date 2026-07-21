"use client";

import { useGym } from "@/lib/gym-context";

export default function JsonLd() {
  const { settings } = useGym();

  const schema = {
    "@context": "https://schema.org",
    "@type": "HealthClub",
    name: settings.gym_name || "TitanForge Gym",
    url: "https://titanforge.pk",
    telephone: settings.phone || "+92 300 1234567",
    email: "hello@titanforge.pk",
    description:
      "Karachi's premium gym with 200+ machines, expert trainers, CrossFit, strength training, mobility, boxing, and more.",
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address || "58-A, Block 6, PECHS, Shahrah-e-Faisal",
      addressLocality: "Karachi",
      addressRegion: "Sindh",
      postalCode: "75400",
      addressCountry: "PK",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "24.8607",
      longitude: "67.0011",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: settings.opening_time || "06:00",
        closes: settings.closing_time || "22:00",
      },
    ],
    image: "https://titanforge.pk/og-image.svg",
    priceRange: "PKR 2,999 - 8,999",
    sameAs: [
      "https://facebook.com/titanforge",
      "https://instagram.com/titanforge",
      `https://wa.me/${settings.whatsapp_number || "923001234567"}`,
    ],
    offers: {
      "@type": "Offer",
      name: "Free Trial",
      description: "7-day free trial for new members",
      price: "0",
      priceCurrency: "PKR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      bestRating: "5",
      reviewCount: "500",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
