"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { ConsultationModal } from "@/components/keil/consultation-modal";

type ConsultationContextValue = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
  shedKinds: string[];
};

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function ConsultationProvider({
  children,
  shedKinds = [],
}: {
  children: ReactNode;
  shedKinds?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ open, close, isOpen, shedKinds }),
    [open, close, isOpen, shedKinds],
  );

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      <ConsultationModal
        open={isOpen}
        onOpenChange={setIsOpen}
        shedKinds={shedKinds}
      />
    </ConsultationContext.Provider>
  );
}

export function useConsultationModal() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) {
    return {
      open: () => undefined,
      close: () => undefined,
      isOpen: false,
      shedKinds: [] as string[],
    };
  }
  return ctx;
}
