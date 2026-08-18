import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DesignPreviewView } from "@/components/client/design-preview-view";
import { getDesignPreviewByToken } from "@/lib/design-previews/store";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const preview = await getDesignPreviewByToken(token);
  if (!preview) return { title: "Preview", robots: { index: false, follow: false } };
  return {
    title: preview.title,
    robots: { index: false, follow: false },
  };
}

export default async function PublicDesignPreviewPage({ params }: Props) {
  const { token } = await params;
  const preview = await getDesignPreviewByToken(token);
  if (!preview) notFound();
  return <DesignPreviewView preview={preview} />;
}
