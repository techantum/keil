import type React from "react"
import type { Metadata } from "next"
import { AdminChrome } from "@/components/admin/admin-chrome"
import { ToastProvider } from "@/components/providers/toast-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { getRepository } from "@/lib/repo"

async function getSettings() {
  try {
    const repo = getRepository()
    return await repo.getSettings()
  } catch (error) {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  const favicon = settings?.branding?.dashboardFavicon || "/favicon.ico"
  
  return {
    title: "Admin Dashboard",
    icons: {
      icon: favicon,
      shortcut: favicon,
    },
  }
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      enableColorScheme={false}
      disableTransitionOnChange={false}
    >
      <ToastProvider>
        <AdminChrome>{children}</AdminChrome>
        <Toaster position="top-right" richColors />
      </ToastProvider>
    </ThemeProvider>
  )
}
