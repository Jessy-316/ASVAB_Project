"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { UserNav } from "@/components/nav/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function Navbar() {
  const { theme, systemTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Wait for mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get current theme accounting for system preference
  const currentTheme = theme === 'system' ? systemTheme : theme

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-sm border-b ${
      currentTheme === 'dark' 
        ? 'bg-gradient-to-r from-white/90 to-black/90' 
        : 'bg-background/80'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex justify-between items-center h-16 ${currentTheme === 'dark' ? 'text-white' : ''}`}>
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            {mounted && ( // Only render image after mounting
              <Image
                src={currentTheme === 'dark' ? '/images/ASVABProject-dark.png' : '/images/ASVABProject.png'}
                alt="ASVABProject Logo"
                width={150}
                height={40}
                className="cursor-pointer object-contain h-10 w-auto"
                onClick={() => router.push('/')}
                priority
                style={{ maxWidth: '150px' }}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src.includes('/images/')) {
                    img.src = currentTheme === 'dark' ? '/ASVABProject-dark.png' : '/ASVABProject.png';
                  }
                }}
              />
            )}
          </div>

          {/* Add theme toggle next to user nav */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <UserNav />
          </div>
        </div>
      </div>
    </nav>
  )
} 
