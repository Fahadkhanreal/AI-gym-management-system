"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SECTION_IDS = ["home", "programs", "facilities", "trainers", "pricing", "testimonials", "faq"];

export default function SectionProgress() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const lastIndexRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = SECTION_IDS.indexOf(entry.target.id);
            // Only update state if index actually changed
            if (idx !== -1 && idx !== lastIndexRef.current) {
              lastIndexRef.current = idx;
              setCurrentIndex(idx);
            }
          }
        }
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 },
    );

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  if (currentIndex === 0) return null;

  return (
    <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 flex flex-col items-end gap-1.5">
      <button
        onClick={() => scrollTo(SECTION_IDS[currentIndex])}
        className="text-xs font-medium text-muted hover:text-cyan transition-colors mb-1 cursor-pointer"
      >
        {String(currentIndex + 1).padStart(2, "0")} / {String(SECTION_IDS.length).padStart(2, "0")}
      </button>
      {SECTION_IDS.map((id, i) => (
        <button
          key={id}
          onClick={() => scrollTo(id)}
          className={`h-1 rounded-full transition-colors duration-500 cursor-pointer hover:opacity-80 ${
            i === currentIndex
              ? "w-6 bg-cyan shadow-[0_0_6px_#00f5ff]"
              : i < currentIndex
                ? "w-3 bg-cyan/40 hover:w-4"
                : "w-3 bg-white/10 hover:w-4"
          }`}
        />
      ))}
    </div>
  );
}
