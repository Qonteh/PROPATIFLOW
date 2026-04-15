import React from "react"

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

/**
 * ResponsiveLayout wraps your content in a beautiful, modern, and responsive container.
 * - Centers content with max width
 * - Adds adaptive padding for all screen sizes
 * - Uses flex column for vertical stacking
 * - Ensures min height for full viewport
 */
export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-10">
        {children}
      </main>
    </div>
  )
}
