"use client"

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
      <ChatBox />
    </main>
  )
}
