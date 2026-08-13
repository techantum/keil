"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Client } from "@/types";
import { asArray } from "@/lib/utils";
import { usePageHero } from "@/hooks/use-public-settings";
import { ScrollReveal } from "@/components/common/scroll-reveal";

export function ClientsGrid() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { hero } = usePageHero("clients");

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => setClients(asArray<Client>(data)))
      .catch(() => setClients([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 h-64 bg-gray-100 animate-pulse rounded-lg" />
      </section>
    );
  }

  if (clients.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <ScrollReveal>
        <div className="container mx-auto px-4">
        {hero?.title && (
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">{hero.title}</h2>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {clients.map((client) => (
            <div key={client.id} className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
              {client.logo && (
                <Image src={client.logo} alt={client.name} width={160} height={80} className="object-contain max-h-16 w-auto" />
              )}
            </div>
          ))}
        </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
