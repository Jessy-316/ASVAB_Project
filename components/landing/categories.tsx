"use client"

import { Card } from "@/components/ui/card"
import { CardHeader } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Calculator, 
  Wrench, 
  Cpu, 
  FileText, 
  Brain, 
  Settings, 
} from "lucide-react"

const categories = [
  {
    id: "gs",
    title: "General Science",
    description: "Physical and biological sciences fundamentals",
    questions: 16,
    timeMinutes: 8,
    icon: BookOpen,
    color: "bg-[hsl(var(--gs-color))]",
    progress: 0
  },
  {
    id: "ar",
    title: "Arithmetic Reasoning",
    description: "Word problems using basic math",
    questions: 16,
    timeMinutes: 39,
    icon: Calculator,
    color: "bg-[hsl(var(--ar-color))]",
    progress: 0
  },
  {
    id: "wk",
    title: "Word Knowledge",
    description: "Understanding word meanings and context",
    questions: 16,
    timeMinutes: 8,
    icon: Brain,
    color: "bg-[hsl(var(--wk-color))]",
    progress: 0
  },
  {
    id: "pc",
    title: "Paragraph Comprehension",
    description: "Reading and understanding written materials",
    questions: 11,
    timeMinutes: 22,
    icon: FileText,
    color: "bg-[hsl(var(--mk-color))]",
    progress: 0
  },
  {
    id: "mk",
    title: "Mathematics Knowledge",
    description: "High school mathematics principles",
    questions: 16,
    timeMinutes: 20,
    icon: Calculator,
    color: "bg-[hsl(var(--ar-color))]",
    progress: 0
  },
  {
    id: "ei",
    title: "Electronics Information",
    description: "Electrical and electronic systems",
    questions: 16,
    timeMinutes: 8,
    icon: Cpu,
    color: "bg-[hsl(var(--gs-color))]",
    progress: 0
  },
  {
    id: "as",
    title: "Auto & Shop Information",
    description: "Automobile technology and shop practices",
    questions: 11,
    timeMinutes: 7,
    icon: Wrench,
    color: "bg-[hsl(var(--wk-color))]",
    progress: 0
  },
  {
    id: "mc",
    title: "Mechanical Comprehension",
    description: "Basic mechanical and physical principles",
    questions: 16,
    timeMinutes: 20,
    icon: Settings,
    color: "bg-[hsl(var(--mk-color))]",
    progress: 0
  },
  {
    id: "ao",
    title: "Assembling Objects",
    description: "Spatial orientation and visualization",
    questions: 16,
    timeMinutes: 15,
    icon: BookOpen,
    color: "bg-[hsl(var(--ar-color))]",
    progress: 0
  }
]

export function Categories() {
  const router = useRouter()

  return (
    <section id="categories-section" className="py-16 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">ASVAB Test Categories</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Master all nine sections of the ASVAB. Each category features targeted practice questions,
            detailed explanations, and progress tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              className="hover:shadow-lg transition-shadow card-military"
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className={`${category.color} dark:bg-gray-800 dark:text-white rounded-md ring-1`}>
                    {category.questions} Questions
                  </Badge>
                  <Badge variant="outline">{category.timeMinutes} min</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <category.icon className="h-5 w-5 text-primary" />
                  <CardTitle>{category.title}</CardTitle>
                </div>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{category.progress}%</span>
                  </div>
                  <Progress value={category.progress} className="h-2" />
                  <div className="flex justify-between gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => router.push(`/practice/${category.id}`)}
                    >
                      Practice
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => router.push(`/study/${category.id}`)}
                    >
                      Study Guide
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
} 
