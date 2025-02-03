"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function Hero() {
  const router = useRouter()

  return (
    <div className="relative px-6 lg:px-8">
      <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
        <div>
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative overflow-hidden rounded-full py-1.5 px-4 text-sm leading-6 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              <span className="text-gray-600">
                Start preparing for your military career.{" "}
                <a href="#features" className="font-semibold text-primary">
                  <span className="absolute inset-0" aria-hidden="true" />
                  Learn more <span aria-hidden="true">&rarr;</span>
                </a>
              </span>
            </div>
          </div>
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              ASVAB Practice Tests
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Comprehensive practice tests for all ASVAB categories. Track your progress, 
              get instant feedback, and improve your scores with AI-powered assistance.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button 
                size="lg"
                onClick={() => router.push('/practice')}
              >
                Start Practice Test
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push('/categories')}
              >
                View Categories
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
