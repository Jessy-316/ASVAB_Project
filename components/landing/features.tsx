"use client"

import { 
  BookOpen, 
  Clock, 
  BarChart3, 
  Brain,
  MessageSquare,
  Target
} from "lucide-react"

const features = [
  {
    name: "Comprehensive Coverage",
    description: "Practice tests covering all 9 ASVAB sections with detailed explanations.",
    icon: BookOpen
  },
  {
    name: "Timed Practice",
    description: "Realistic test environment with section-specific time limits.",
    icon: Clock
  },
  {
    name: "Performance Analytics",
    description: "Track your progress and identify areas for improvement.",
    icon: BarChart3
  },
  {
    name: "Smart Learning",
    description: "AI-powered study recommendations based on your performance.",
    icon: Brain
  },
  {
    name: "Expert Assistance",
    description: "Get help from our AI tutor for detailed explanations.",
    icon: MessageSquare
  },
  {
    name: "Score Targeting",
    description: "Set goals and track your path to your desired AFQT score.",
    icon: Target
  }
]

export function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Master the ASVAB with Confidence
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our comprehensive practice platform helps you prepare effectively for all aspects of the ASVAB test.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <feature.icon className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
} 
