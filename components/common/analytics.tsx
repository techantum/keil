"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function Analytics({
  gaId,
  enabled = false,
}: {
  gaId?: string;
  enabled?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const measurementId = gaId || process.env.NEXT_PUBLIC_GA_ID || "";
  const isEnabled = enabled || Boolean(process.env.NEXT_PUBLIC_GA_ID);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag && measurementId) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      (window as unknown as { gtag: (...args: unknown[]) => void }).gtag("config", measurementId, {
        page_path: url,
      });
    }
  }, [pathname, searchParams, measurementId]);

  if (!isEnabled || !measurementId) {
    return null;
  }

  return (
    <>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
