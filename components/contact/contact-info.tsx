"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ContactPageContent, Settings } from "@/types";
import { defaultContactPageContent, defaultPublicSettings, withDefault } from "@/lib/content/default-content";

const DEFAULT_CONTACT = defaultContactPageContent();
const DEFAULT_COMPANY = defaultPublicSettings().company;

function formatAddress(company?: Settings["company"]) {
  if (!company?.address) return DEFAULT_CONTACT.contactInfo.office.address;
  const { street, city, state, zipCode, country } = company.address;
  return [street, city, state, zipCode, country].filter(Boolean).join(", ");
}

export function ContactInfo() {
  const [content, setContent] = useState<ContactPageContent>(DEFAULT_CONTACT);
  const [company, setCompany] = useState<Settings["company"]>(DEFAULT_COMPANY);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/content/contact").then((res) => res.json()),
      fetch("/api/settings").then((res) => res.json()),
    ])
      .then(([contactData, settingsData]) => {
        if (contactData && !contactData.error) {
          setContent({
            ...DEFAULT_CONTACT,
            ...contactData,
            hero: { ...DEFAULT_CONTACT.hero, ...contactData.hero },
            contactInfo: {
              email: {
                ...DEFAULT_CONTACT.contactInfo.email,
                ...contactData.contactInfo?.email,
              },
              phone: {
                ...DEFAULT_CONTACT.contactInfo.phone,
                ...contactData.contactInfo?.phone,
              },
              office: {
                ...DEFAULT_CONTACT.contactInfo.office,
                ...contactData.contactInfo?.office,
              },
            },
          });
        }
        if (settingsData?.company) {
          setCompany({ ...DEFAULT_COMPANY, ...settingsData.company });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="h-64 animate-pulse rounded bg-gray-200" />;
  }

  const email = {
    title: withDefault(content.contactInfo.email.title, DEFAULT_CONTACT.contactInfo.email.title),
    description: withDefault(content.contactInfo.email.description, DEFAULT_CONTACT.contactInfo.email.description),
    value: withDefault(content.contactInfo.email.value, company.email || DEFAULT_CONTACT.contactInfo.email.value),
  };
  const phone = {
    title: withDefault(content.contactInfo.phone.title, DEFAULT_CONTACT.contactInfo.phone.title),
    description: withDefault(content.contactInfo.phone.description, DEFAULT_CONTACT.contactInfo.phone.description),
    value: withDefault(content.contactInfo.phone.value, company.phone || DEFAULT_CONTACT.contactInfo.phone.value),
  };
  const office = {
    title: withDefault(content.contactInfo.office.title, DEFAULT_CONTACT.contactInfo.office.title),
    address: withDefault(content.contactInfo.office.address, formatAddress(company)),
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-3 text-4xl font-bold text-gray-900">{content.hero.title}</h2>
        <p className="text-base text-gray-600">{content.hero.subtitle}</p>
      </div>

      <div className="space-y-8">
        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <Image src="/images/icons/email-icon.png" alt="" width={28} height={28} />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">{email.title}</h3>
            <p className="mb-2 text-gray-600">{email.description}</p>
            <a href={`mailto:${email.value}`} className="font-medium text-brand-primary hover:underline">
              {email.value}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <Image src="/images/icons/phone-icon.png" alt="" width={28} height={28} />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">{phone.title}</h3>
            <p className="mb-2 text-gray-600">{phone.description}</p>
            <a href={`tel:${phone.value.replace(/\s/g, "")}`} className="font-medium text-brand-primary hover:underline">
              {phone.value}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
            <Image src="/images/icons/location-icon.png" alt="" width={28} height={28} />
          </div>
          <div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">{office.title}</h3>
            <p className="whitespace-pre-line text-gray-600">{office.address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
