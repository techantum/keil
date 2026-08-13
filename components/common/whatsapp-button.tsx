"use client";

import { MessageCircle } from "lucide-react";
import { usePublicSettings } from "@/hooks/use-public-settings";

export function WhatsAppButton() {
  const { settings, loading } = usePublicSettings();
  const whatsappNumber =
    settings?.company?.socialMedia?.whatsapp ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (loading || !whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 transition-colors hover:scale-110 transform duration-200"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
