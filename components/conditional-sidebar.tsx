// components/conditional-sidebar.tsx
// Client component yang membungkus AppSidebar.
// Memakai usePathname() untuk cek apakah sidebar perlu ditampilkan.
// Dipanggil dari app/layout.tsx (Server Component).

"use client"

import { usePathname } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"

// Daftar path yang TIDAK menampilkan sidebar
const HIDE_SIDEBAR_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
]

export function ConditionalSidebar({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Cek apakah path saat ini ada di daftar pengecualian
  const hideSidebar = HIDE_SIDEBAR_PATHS.some((path) =>
    pathname.startsWith(path)
  )

  // Jika halaman auth → render children langsung, tanpa sidebar
  if (hideSidebar) {
    return (
      <div className="min-h-svh flex items-center justify-center bg-muted/40">
        {children}
      </div>
    )
  }

  // Halaman lain → render dengan sidebar
  return (
  <AppSidebar>
    {children}
    </AppSidebar>
    )
}
