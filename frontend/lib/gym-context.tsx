"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from "react";

export interface GymSettings {
  gym_name: string;
  tagline: string;
  address: string;
  phone: string;
  whatsapp_number: string;
  opening_time: string;
  closing_time: string;
}

const defaults: GymSettings = {
  gym_name: "TitanForge",
  tagline: "Premium Fitness",
  address: "",
  phone: "",
  whatsapp_number: "",
  opening_time: "",
  closing_time: "",
};

interface GymContextType {
  settings: GymSettings;
  loading: boolean;
}

const GymContext = createContext<GymContextType>({
  settings: defaults,
  loading: true,
});

export function useGym() {
  return useContext(GymContext);
}

export function GymProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GymSettings>(defaults);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data?.gym_name) {
          setSettings({
            gym_name: data.gym_name || defaults.gym_name,
            tagline: data.tagline || defaults.tagline,
            address: data.address || "",
            phone: data.phone || "",
            whatsapp_number: data.whatsapp_number || "",
            opening_time: data.opening_time || "",
            closing_time: data.closing_time || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <GymContext.Provider value={{ settings, loading }}>
      {children}
    </GymContext.Provider>
  );
}
