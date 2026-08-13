import type React from "react"
import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
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
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <main className="admin-compact flex min-h-0 flex-1 flex-col overflow-y-auto bg-gradient-to-b from-slate-50 to-indigo-50/40 dark:bg-slate-900">
            {children}
          </main>
        </div>
        <Toaster position="top-right" richColors />
      </ToastProvider>
    </ThemeProvider>
  )
}
