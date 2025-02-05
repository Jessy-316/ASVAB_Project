"use client"

import { useState, useEffect } from 'react'
import { PauseIcon, SettingsIcon } from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
}

const sampleQuestions: Question[] = Array(31).fill(null).map((_, index) => ({
  id: index + 1,
  question: "Sample ASVAB question text will go here. This is question " + (index + 1),
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: "Option A"
}))

export default function TestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [showAnswered, setShowAnswered] = useState(true)
  const [showUnanswered, setShowUnanswered] = useState(true)
  const [time, setTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!isPaused) {
      timer = setInterval(() => {
        setTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPaused])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-64 border-r p-4 bg-white">
        <h2 className="font-bold mb-4">Filters</h2>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Sections</h3>
          <label className="flex items-center mb-2">
            <input type="checkbox" className="mr-2" defaultChecked />
            Practice Test
          </label>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Answers</h3>
          <label className="flex items-center mb-2">
            <input 
              type="checkbox" 
              className="mr-2"
              checked={showAnswered}
              onChange={(e) => setShowAnswered(e.target.checked)}
            />
            Answered
          </label>
          <label className="flex items-center">
            <input 
              type="checkbox" 
              className="mr-2"
              checked={showUnanswered}
              onChange={(e) => setShowUnanswered(e.target.checked)}
            />
            Unanswered
          </label>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-2">Questions</h3>
          <div className="grid grid-cols-6 gap-1">
            {Array(31).fill(null).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`p-2 text-center text-sm ${
                  currentQuestion === index 
                    ? 'bg-blue-500 text-white' 
                    : answers[index] 
                      ? 'bg-gray-200' 
                      : 'bg-gray-100'
                } hover:bg-blue-200`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <span className="bg-gray-100 px-3 py-1 rounded">
                {formatTime(time)}
              </span>
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className="p-2 hover:bg-gray-100 rounded"
              >
                <PauseIcon size={20} />
              </button>
            </div>

            <div className="text-center">
              Practice Test - Question {currentQuestion + 1} (1 of 31)
            </div>

            <button className="p-2 hover:bg-gray-100 rounded">
              <SettingsIcon size={20} />
            </button>
          </div>

          {/* Question Content */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-lg mb-6">{sampleQuestions[currentQuestion].question}</p>
            
            <div className="space-y-3">
              {sampleQuestions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: option }))}
                  className={`w-full text-left p-3 rounded ${
                    answers[currentQuestion] === option
                      ? 'bg-blue-500 text-white'
                      : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="flex justify-between items-center">
            <div className="space-x-4">
              <button className="text-blue-500 hover:underline">Report an error</button>
              <button className="text-blue-500 hover:underline">Help</button>
              <button className="text-blue-500 hover:underline">Shortcuts</button>
            </div>

            <div className="space-x-4">
              <button
                onClick={() => currentQuestion > 0 && setCurrentQuestion(prev => prev - 1)}
                disabled={currentQuestion === 0}
                className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded">
                Finish
              </button>
              <button
                onClick={() => currentQuestion < 30 && setCurrentQuestion(prev => prev + 1)}
                disabled={currentQuestion === 30}
                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
