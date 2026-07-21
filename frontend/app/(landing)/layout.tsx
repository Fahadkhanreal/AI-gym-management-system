import LenisProvider from "@/components/LenisProvider";
import ScrollProgress from "@/components/ScrollProgress";
import SectionProgress from "@/components/SectionProgress";
import BackToTop from "@/components/BackToTop";
import ChatBot from "@/components/ChatBot";
import ModalProvider from "@/components/ModalProvider";
import JsonLd from "@/components/JsonLd";
import { GymProvider } from "@/lib/gym-context";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GymProvider>
      <ModalProvider>
        <LenisProvider>
          <ScrollProgress />
          <SectionProgress />
          {children}
          <BackToTop />
          <ChatBot />
        </LenisProvider>
        <JsonLd />
      </ModalProvider>
    </GymProvider>
  );
}