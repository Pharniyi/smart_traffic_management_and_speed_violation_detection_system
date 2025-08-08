import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Traffic Monitoring App",
  description: "Monitor traffic density and violations in real-time",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="mobile-container relative w-full max-w-[420px] h-[100dvh] overflow-hidden bg-background shadow-xl rounded-t-xl">
              {children}
            </div>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
