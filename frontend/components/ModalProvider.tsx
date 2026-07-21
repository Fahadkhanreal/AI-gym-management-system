"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import ContactModal from "./ContactModal";
import TrialModal from "./TrialModal";

interface ModalContextType {
  openContact: (subject?: string) => void;
  openTrial: () => void;
}

const ModalContext = createContext<ModalContextType>({
  openContact: () => {},
  openTrial: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}

export default function ModalProvider({ children }: { children: ReactNode }) {
  const [contactOpen, setContactOpen] = useState(false);
  const [trialOpen, setTrialOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState<string | undefined>();

  const openContact = (subject?: string) => {
    setContactSubject(subject);
    setContactOpen(true);
  };

  return (
    <ModalContext.Provider value={{ openContact, openTrial: () => setTrialOpen(true) }}>
      {children}
      <ContactModal
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
        defaultSubject={contactSubject}
      />
      <TrialModal
        isOpen={trialOpen}
        onClose={() => setTrialOpen(false)}
      />
    </ModalContext.Provider>
  );
}
