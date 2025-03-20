"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Navbar } from "@/components/nav/navbar"

export function Hero() {
  const { theme, systemTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Wait for mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Get current theme accounting for system preference
  const currentTheme = theme === 'system' ? systemTheme : theme

  const scrollToCategories = () => {
    const categoriesSection = document.getElementById('categories')
    if (categoriesSection) {
      categoriesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Use the Navbar component */}
      <Navbar />

      {/* Main Content Container - Add padding-top to prevent navbar overlap */}
      <main className="pt-16">
        {/* Hero Section with Background Image */}
        <div className="relative">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/military1.jpg"
              alt="Military Jets Formation"
              fill
              className="object-cover"
              priority
            />
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content */}
          <div className="relative z-10 px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
              <div>
                <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                  <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-200/10 hover:ring-gray-200/20 bg-white/10">
                    <span className="text-gray-100">
                      Start preparing for your military career.{" "}
                      <a 
                        href="#features" 
                        className="font-semibold text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          const featuresSection = document.getElementById('features');
                          if (featuresSection) {
                            featuresSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        Learn more <span aria-hidden="true">&rarr;</span>
                      </a>
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    ASVAB Practice Tests
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-200">
                    Comprehensive practice tests for all ASVAB categories. Track your progress, 
                    get instant feedback, and improve your scores with AI-powered assistance.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button 
                      size="lg"
                      className="bg-[#000A1F] hover:bg-white hover:text-[#000A1F] text-white font-semibold rounded-lg transition-all duration-200 border-2 border-transparent hover:border-[#000A1F]"
                      onClick={() => router.push('/practice')}
                    >
                      Start Practice Test
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="text-[#000A1F] dark:text-white border-white hover:text-white"
                      onClick={() => {
                        const section = document.getElementById('categories-section');
                        if (section) {
                          section.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      View Categories
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
} 
