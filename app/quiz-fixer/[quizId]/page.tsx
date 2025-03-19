import { Metadata } from 'next'

interface QuizFixerPageProps {
  params: {
    quizId: string
  }
}

export const metadata: Metadata = {
  title: 'Quiz Fixer',
  description: 'Fix and review quiz questions',
}

export default async function QuizFixerPage({ params }: QuizFixerPageProps) {
  const { quizId } = params

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Quiz Fixer</h1>
      <p>Quiz ID: {quizId}</p>
      {/* Add your quiz fixing functionality here */}
    </div>
  )
} 
