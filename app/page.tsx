"use client"

import Link from 'next/link'
import { Hero } from '@/components/landing/hero'
import { Features } from '@/components/landing/features'
import { Categories } from '@/components/landing/categories'
import { ChatBox } from '@/components/chat/chat-box'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <Categories />
      <div className="container mx-auto text-center py-12">
        <Link 
          href="/practice" 
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        >
          Start Practice Test
        </Link>
      </div>
      <ChatBox />
    </main>
  )
}
