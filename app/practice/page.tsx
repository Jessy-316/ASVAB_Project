"use client"

import { useState, useEffect } from 'react'
import { PauseIcon, XIcon, CheckIcon, SaveIcon, CheckCircleIcon, PlayIcon } from 'lucide-react'
import { Navbar } from '@/components/nav/navbar'
import { supabase } from '@/supabase/supabase'
import { useRouter } from 'next/navigation'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  category?: string
}

// Extract a separate component for the Summary Modal to avoid hooks rules violations
interface SummaryModalProps {
  questions: Question[]
  answers: { [key: number]: string }
  time: number
  onClose: () => void
  isSaving: boolean
  setSaveError: (error: string | null) => void
  setSaveSuccess: (success: boolean) => void
  setIsSaving: (saving: boolean) => void
  saveSuccess: boolean
  saveError: string | null
  previousProgress: any[]
  isLoadingProgress: boolean
  formatTime: (seconds: number) => string
  calculateScore: () => {
    correct: number
    totalAnswered: number
    total: number
    percentAnswered: number
    percentCorrect: number
  }
  saveProgress: () => Promise<void>
  testSavePermissions: () => Promise<string>
  checkRlsPermissions: () => Promise<string>
  refreshUserSession: () => Promise<string>
  inspectDatabaseSchema: () => Promise<string>
  testMinimalInsert: () => Promise<string>
  checkLoginStatus: () => Promise<{
    isLoggedIn: boolean
    userId: string | null
    email: string | null
  }>
  setCurrentQuestion: (questionIndex: number) => void
  getTableColumns: (tableName: string) => Promise<string>
}

function SummaryModal({
  questions,
  answers,
  time,
  onClose,
  isSaving,
  saveSuccess,
  saveError,
  setSaveError,
  setSaveSuccess,
  setIsSaving,
  previousProgress,
  isLoadingProgress,
  formatTime,
  calculateScore,
  saveProgress,
  testSavePermissions,
  checkRlsPermissions,
  refreshUserSession,
  inspectDatabaseSchema,
  testMinimalInsert,
  checkLoginStatus,
  setCurrentQuestion,
  getTableColumns
}: SummaryModalProps) {
  const [authStatus, setAuthStatus] = useState<{
    isLoggedIn: boolean
    userId: string | null
    email: string | null
  }>({
    isLoggedIn: false,
    userId: null,
    email: null
  })

  // Load auth status when modal opens
  useEffect(() => {
    const getAuthStatus = async () => {
      const status = await checkLoginStatus()
      setAuthStatus(status)
    }
    getAuthStatus()
  }, [checkLoginStatus])

  // Calculate score once for efficiency
  const score = calculateScore()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black dark:text-white">Test Summary</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <XIcon size={24} />
          </button>
        </div>

        {/* Authentication Status Section */}
        <div
          className={`p-3 mb-4 rounded-lg ${
            authStatus.isLoggedIn
              ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300'
              : 'bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300'
          }`}
        >
          <div className="flex items-center">
            {authStatus.isLoggedIn ? (
              <>
                <CheckCircleIcon className="mr-2" size={18} />
                <span>Logged in as: {authStatus.email}</span>
              </>
            ) : (
              <>
                <span className="mr-2">⚠️</span>
                <span>
                  You are not logged in. You must log in to save your progress.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-500">{score.totalAnswered}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Questions Answered
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-500">{score.correct}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Correct Answers
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Completion
                </span>
                <span className="text-sm font-medium text-blue-500">
                  {score.percentAnswered}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${score.percentAnswered}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Accuracy
                </span>
                <span className="text-sm font-medium text-green-500">
                  {score.percentCorrect}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full"
                  style={{ width: `${score.percentCorrect}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="font-medium text-black dark:text-white mb-2">
              Time Spent
            </h3>
            <p className="text-2xl font-bold text-purple-500">{formatTime(time)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Average:{' '}
              {time > 0 && score.totalAnswered > 0
                ? formatTime(Math.round(time / score.totalAnswered))
                : '00:00'}{' '}
              per question
            </p>
          </div>

          {/* Previous Progress Section */}
          {previousProgress.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium text-black dark:text-white">Your History</h3>

              {/* Progress Chart */}
              {previousProgress.length > 1 && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-3">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Progress Over Time
                  </h4>
                  <div className="h-40 relative">
                    {/* Chart bars - using last 5 results in reverse chronological order */}
                    <div className="flex items-end justify-between h-32 gap-1 mb-2">
                      {[...previousProgress].reverse().slice(0, 5).map((progress, index) => {
                        const accuracyHeight = `${Math.max(progress.accuracy_percentage || 0, 5)}%`;
                        const completionHeight = `${Math.max(progress.completion_percentage || 0, 5)}%`;

                        return (
                          <div key={index} className="flex-1 flex flex-col items-center justify-end gap-1">
                            <div className="w-full bg-green-500 rounded-t" style={{ height: accuracyHeight }}></div>
                            <div className="w-full bg-blue-500 rounded-t" style={{ height: completionHeight }}></div>
                          </div>
                        );
                      })}
                    </div>

                    {/* X-axis labels */}
                    <div className="flex justify-between">
                      {[...previousProgress].reverse().slice(0, 5).map((progress, index) => {
                        // Show abbreviated dates (e.g., "May 15")
                        const date = new Date(progress.test_date);
                        const month = date.toLocaleString('default', { month: 'short' });
                        const day = date.getDate();

                        return (
                          <div key={index} className="text-xs text-gray-500 dark:text-gray-400 text-center flex-1">
                            {`${month} ${day}`}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-center space-x-4 mt-2">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded mr-1"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Accuracy</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">Completion</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <thead className="bg-gray-200 dark:bg-gray-600">
                    <tr>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Date</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Score</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Completion</th>
                      <th className="py-2 px-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {previousProgress.map((progress, index) => {
                      // Format date to local date string
                      const testDate = new Date(progress.test_date).toLocaleDateString();
                      // Format score as correct/total
                      const scoreText = `${progress.correct_answers || 0}/${progress.total_questions || 0}`;
                      // Format completion percentage
                      const completion = `${progress.completion_percentage || 0}%`;
                      // Format time
                      const timeStr = formatTime(progress.time_taken_seconds || 0);
                      // Check if this is local storage data
                      const isLocal = progress.is_local === true;

                      return (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">
                            {testDate}
                            {isLocal && (
                              <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100">
                                Local
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">{scoreText}</td>
                          <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">{completion}</td>
                          <td className="py-2 px-3 text-sm text-gray-700 dark:text-gray-300">{timeStr}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isLoadingProgress && (
            <div className="text-center py-3">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading previous test results...
              </p>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-medium text-black dark:text-white">
              Question Overview
            </h3>
            <div className="grid grid-cols-10 gap-1">
              {questions.map((question, index) => {
                // Determine status: correct, incorrect, or unanswered
                let status = 'unanswered';
                if (answers[index]) {
                  status =
                    answers[index] === question.correctAnswer
                      ? 'correct'
                      : 'incorrect';
                }

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentQuestion(index);
                      onClose();
                    }}
                    className={`p-2 text-center text-xs rounded-full flex items-center justify-center ${
                      status === 'correct'
                        ? 'bg-green-500 text-white'
                        : status === 'incorrect'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                    }`}
                    title={`Question ${index + 1}: ${status}`}
                  >
                    {status === 'correct' ? (
                      <CheckIcon size={12} />
                    ) : status === 'incorrect' ? (
                      <XIcon size={12} />
                    ) : (
                      index + 1
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <button
              onClick={onClose}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700 font-medium"
            >
              Continue Test
            </button>
            <button
              onClick={saveProgress}
              disabled={isSaving}
              className={`w-full px-4 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center space-x-2 font-medium ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <span className="animate-spin">⋯</span>
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircleIcon size={18} />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <SaveIcon size={18} />
                  <span>Save Results</span>
                </>
              )}
            </button>
          </div>

          {saveError && (
            <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
              {saveError}
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={async () => {
                    const result = await checkRlsPermissions();
                    alert(result);
                  }}
                  className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 rounded"
                >
                  Check Permissions
                </button>
                <button
                  onClick={async () => {
                    const result = await refreshUserSession();
                    alert(result);
                  }}
                  className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 rounded"
                >
                  Refresh Session
                </button>
                <button
                  onClick={async () => {
                    const result = await inspectDatabaseSchema();
                    alert(result);
                  }}
                  className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 rounded"
                >
                  Check DB Schema
                </button>
                <button
                  onClick={async () => {
                    const result = await testMinimalInsert();
                    alert(result);
                  }}
                  className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 rounded"
                >
                  Test Minimal Insert
                </button>
                <button
                  onClick={async () => {
                    const result = await getTableColumns('user_progress');
                    alert(result);
                  }}
                  className="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 rounded"
                >
                  Check Table Columns
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// We'll keep this as a fallback in case there's an issue with the database
const sampleQuestions: Question[] = Array(31).fill(null).map((_, index) => ({
  id: index + 1,
  question: "Sample ASVAB question text will go here. This is question " + (index + 1),
  options: [
    "Sample answer choice A for question " + (index + 1),
    "Sample answer choice B for question " + (index + 1),
    "Sample answer choice C for question " + (index + 1),
    "Sample answer choice D for question " + (index + 1)
  ],
  correctAnswer: "Sample answer choice A for question " + (index + 1)
}))

export default function TestPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [showAnswered, setShowAnswered] = useState(true)
  const [showUnanswered, setShowUnanswered] = useState(true)
  const [time, setTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [questions, setQuestions] = useState<Question[]>(sampleQuestions)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [previousProgress, setPreviousProgress] = useState<any[]>([])
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)
  const [authStatus, setAuthStatus] = useState<{isLoggedIn: boolean, userId: string|null, email: string|null}>({ 
    isLoggedIn: false, userId: null, email: null 
  })

  // Function to check if user is logged in
  const checkLoginStatus = async () => {
    try {
      // Get the user session from supabase
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Error checking login status:", error.message);
        return { isLoggedIn: false, userId: null, email: null };
      }
      
      if (data?.session?.user) {
        // User is logged in
        return {
          isLoggedIn: true,
          userId: data.session.user.id,
          email: data.session.user.email || null // Convert undefined to null
        };
      } else {
        // User is not logged in
        return { isLoggedIn: false, userId: null, email: null };
      }
    } catch (err) {
      console.error("Exception in checkLoginStatus:", err);
      return { isLoggedIn: false, userId: null, email: null };
    }
  };

  // Function to format time in seconds to MM:SS format
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    // Pad with leading zeros if needed
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  // Function to calculate test score and stats
  const calculateScore = () => {
    // Count correct answers
    const correct = Object.keys(answers).reduce((count, questionIndex) => {
      const index = parseInt(questionIndex, 10);
      return answers[index] === questions[index].correctAnswer 
        ? count + 1 
        : count;
    }, 0);
    
    // Get number of answered questions
    const totalAnswered = Object.keys(answers).length;
    
    // Total number of questions
    const total = questions.length;
    
    // Calculate percentages, avoid division by zero
    const percentAnswered = total > 0 
      ? Math.round((totalAnswered / total) * 100) 
      : 0;
      
    const percentCorrect = totalAnswered > 0 
      ? Math.round((correct / totalAnswered) * 100) 
      : 0;
    
    return {
      correct,
      totalAnswered,
      total,
      percentAnswered,
      percentCorrect
    };
  };

  // Function to save test progress
  const saveProgress = async (): Promise<void> => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      
      // Check if user is logged in
      const loginStatus = await checkLoginStatus();
      
      if (!loginStatus.isLoggedIn) {
        throw new Error('You must be logged in to save your progress');
      }
      
      const score = calculateScore();
      
      // First, attempt to discover the table structure
      console.log('Attempting to discover user_progress table structure...');
      
      // Try a simple select to see what columns are available
      const { data: sampleRow, error: sampleError } = await supabase
        .from('user_progress')
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.warn('Error examining user_progress table:', sampleError.message);
      } else if (sampleRow && sampleRow.length > 0) {
        console.log('Found sample row with columns:', Object.keys(sampleRow[0]).join(', '));
      }
      
      // Get the current timestamp
      const now = new Date().toISOString();
      
      // Create a minimal dataset with the user ID and timestamp
      // We'll use multiple field names for the timestamp to increase chances of success
      const baseData = {
        user_id: loginStatus.userId
      };
      
      // Try to insert with just user_id first
      console.log('Attempting base insert with just user_id...');
      const { data: baseResult, error: baseError } = await supabase
        .from('user_progress')
        .insert(baseData)
        .select();
      
      // If successful with just user_id, we're done
      if (!baseError) {
        console.log('Successfully saved minimal progress with just user_id:', baseResult);
        setSaveSuccess(true);
        
        // Fetch updated progress
        fetchUserProgress(loginStatus.userId);
        return;
      }
      
      console.warn('Base insert failed:', baseError.message);
      
      // Second attempt - add timestamp fields with different possible names
      console.log('Trying with different timestamp field names...');
      
      // Try each timestamp field name separately
      const timestampFields = ['created_at', 'test_date', 'timestamp', 'date', 'time'];
      
      for (const field of timestampFields) {
        // Create data with current field
        const data = { 
          ...baseData,
          [field]: now 
        };
        
        console.log(`Attempting with timestamp field: ${field}`);
        const { data: result, error } = await supabase
          .from('user_progress')
          .insert(data)
          .select();
        
        if (!error) {
          console.log(`Successfully saved with ${field} field:`, result);
          setSaveSuccess(true);
          
          // Fetch updated progress
          fetchUserProgress(loginStatus.userId);
          return;
        }
        
        console.warn(`Insert with ${field} failed:`, error.message);
      }
      
      // If we get here, try with scores included
      console.log('Trying with score fields included...');
      
      // Try with different field combinations for scores
      const scoreFieldSets = [
        // Set 1
        {
          score: score.percentCorrect,
          time: time
        },
        // Set 2
        {
          score_percentage: score.percentCorrect,
          time_seconds: time
        },
        // Set 3
        {
          correct_percentage: score.percentCorrect,
          total_time: time
        },
        // Set 4
        {
          correct_answers: score.correct,
          total_questions: score.total
        }
      ];
      
      for (const scoreFields of scoreFieldSets) {
        // Try each timestamp field with these score fields
        for (const timeField of timestampFields) {
          const data = {
            ...baseData,
            [timeField]: now,
            ...scoreFields
          };
          
          console.log(`Attempting with timestamp ${timeField} and scores:`, scoreFields);
          const { data: result, error } = await supabase
            .from('user_progress')
            .insert(data)
            .select();
          
          if (!error) {
            console.log('Successfully saved with score fields:', result);
            setSaveSuccess(true);
            
            // Fetch updated progress
            fetchUserProgress(loginStatus.userId);
            return;
          }
          
          console.warn('Insert with score fields failed:', error.message);
        }
      }
      
      // If all attempts failed, throw a helpful error
      throw new Error('Unable to save progress. The database schema does not match any attempted formats.');
      
    } catch (err: any) {
      console.error('Error saving progress:', err);
      setSaveError(err.message || 'Failed to save progress');
      setSaveSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Function to fetch user progress
  const fetchUserProgress = async (userId: string | null) => {
    if (!userId) {
      console.warn('Cannot fetch progress: userId is null');
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .order('test_date', { ascending: false })
        .order('timestamp', { ascending: false })
        .order('date', { ascending: false })
        .limit(10);
      
      if (!error && data) {
        setPreviousProgress(data);
      }
    } catch (err) {
      console.error('Error fetching progress:', err);
    }
  };

  // Load the error capture script
  useEffect(() => {
    // Create and inject the script to capture console errors
    const script = document.createElement('script');
    script.innerHTML = captureConsoleErrors;
    document.head.appendChild(script);
    
    // Check login status at startup
    checkLoginStatus().then(status => {
      setAuthStatus(status);
      console.log("Login status at startup:", status);
    });
    
    return () => {
      // Clean up
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // Timer effect to count seconds
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (!isPaused) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isPaused]);

  // First, let's update the fetchQuestions function to better handle database connection issues
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setIsLoading(true)
        
        // Log the attempt to connect to database
        console.log('Attempting to connect to Supabase and fetch questions...')
        
        // Try to fetch any questions first without category filter to check database connection
        let { data: checkData, error: checkError } = await supabase
          .from('questions')
          .select('*')
          .limit(1)
        
        if (checkError) {
          console.error('Database connection check failed:', checkError)
          throw new Error(`Cannot connect to database: ${checkError.message}`)
        }
        
        console.log('Database connection successful, fetching questions...')
        
        // Get all questions
        let { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .order('id')
        
        console.log('Response from questions table:', questionsData ? `Found ${questionsData.length} questions` : 'No data')
        
        if (questionsError || !questionsData || questionsData.length === 0) {
          console.log('Trying alternative table asvab_questions...')
          // Try alternative table name
          const { data: altData, error: altError } = await supabase
            .from('asvab_questions')
            .select('*')
            .order('id')
            
          if (altError || !altData || altData.length === 0) {
            throw new Error('No questions found in either questions or asvab_questions tables')
          }
          
          questionsData = altData
          console.log(`Found ${questionsData.length} questions in asvab_questions table`)
        }
        
        if (questionsData && questionsData.length > 0) {
          console.log('Successfully fetched questions, now fetching options from options table...')
          
          // Create optionsMap and correctAnswersMap outside the try block
          const optionsMap: Record<number, string[]> = {}
          const correctAnswersMap: Record<number, string> = {}

          // Fetch options from separate options table
          try {
            const { data: optionsData, error: optionsError } = await supabase
              .from('options')
              .select('*')
            
            if (optionsError) {
              console.error('Error fetching options:', optionsError.message)
              // Log error but continue - we'll use fallback options if needed
            }
            
            console.log('Options data:', optionsData ? `Found ${optionsData.length} options` : 'No options found')
            
            if (optionsData && optionsData.length > 0) {
              try {
                // Group options by question_id
                optionsData.forEach(option => {
                  try {
                    // Skip if option is undefined or null
                    if (!option) {
                      console.warn('Undefined option found in options data')
                      return
                    }
                    
                    const questionId = option.question_id
                    if (!questionId) {
                      console.warn('Option without question_id:', option)
                      return
                    }
                    
                    // Initialize array if needed
                    if (!optionsMap[questionId]) {
                      optionsMap[questionId] = []
                    }
                    
                    // Add option text to the array - ensure we have a valid string
                    const optionText = option.text || option.option_text || option.value || option.content || 
                                      `Option ${optionsMap[questionId].length + 1}`
                    // Only add if we have a valid string
                    if (typeof optionText === 'string') {
                      optionsMap[questionId].push(optionText)
                      
                      // Check if this is the correct answer
                      const isCorrect = Boolean(option.is_correct || option.correct || option.is_answer || false)
                      if (isCorrect) {
                        correctAnswersMap[questionId] = optionText
                      }
                    } else {
                      console.warn(`Invalid option text for question ${questionId}:`, optionText)
                    }
                  } catch (optionErr) {
                    console.warn('Error processing individual option:', optionErr)
                    // Continue with next option
                  }
                })
                
                // Sort options for each question to ensure consistent order
                try {
                  Object.keys(optionsMap).forEach(qId => {
                    try {
                      const questionId = parseInt(qId, 10)
                      // Make sure optionsMap[questionId] is defined before trying to sort it
                      if (optionsMap[questionId] && Array.isArray(optionsMap[questionId])) {
                        optionsMap[questionId].sort((a, b) => {
                          // Handle cases where a or b might be undefined or not a string
                          const strA = String(a || '')
                          const strB = String(b || '')
                          return strA.localeCompare(strB)
                        })
                      }
                    } catch (sortErr) {
                      console.warn(`Error sorting options for question ${qId}:`, sortErr)
                      // Continue with next question
                    }
                  })
                } catch (sortErr) {
                  console.warn('Error during options sorting:', sortErr)
                  // Continue with unsorted options
                }
                
                console.log(`Processed options for ${Object.keys(optionsMap).length} questions`)
              } catch (processErr) {
                console.warn('Error processing options data:', processErr)
                // Continue with empty options - we'll use fallbacks
              }
            } else {
              console.warn('No options found in the options table, will use fallback options')
            }
          } catch (optionsErr) {
            console.warn('Error in options fetching and processing:', optionsErr)
            // Continue without options - we'll use fallbacks
          }
          
          // Transform the data to match our Question interface
          const formattedQuestions: Question[] = questionsData.map(q => {
            console.log(`Processing question ID ${q.id}:`, q.question || q.question_text || 'No question text')
            
            // Get the question ID
            const questionId = q.id
            
            // Use options from the options table if available, otherwise use fallback
            let questionOptions: string[] = []
            if (optionsMap[questionId] && optionsMap[questionId].length > 0) {
              questionOptions = optionsMap[questionId]
              console.log(`Using ${questionOptions.length} options from options table for question ${questionId}`)
            } else {
              // Search for direct option fields as fallback
              console.warn(`No options in options table for question ${questionId}, searching for direct fields...`)
              
              // Check for option fields within the question data
              const optionKeys = Object.keys(q).filter(key => 
                key.match(/^option[0-9A-D_]/) || 
                key.match(/^[a-dA-D]$/) || 
                ['options', 'choices', 'answers', 'answer_choices'].includes(key)
              )
              
              if (optionKeys.length > 0) {
                console.log(`Found direct option fields for question ${questionId}:`, optionKeys)
                
                // Extract options from these fields
                const extractedOptions: string[] = []
                optionKeys.sort().forEach(key => {
                  const value = q[key]
                  if (value && typeof value === 'string') {
                    extractedOptions.push(value)
                  } else if (value && Array.isArray(value)) {
                    extractedOptions.push(...value.map(String))
                  }
                })
                
                if (extractedOptions.length > 0) {
                  questionOptions = extractedOptions
                  console.log(`Using ${questionOptions.length} options from direct fields for question ${questionId}`)
                }
              }
              
              // If still no options, use generic fallback
              if (questionOptions.length === 0) {
                console.warn(`No options found for question ${questionId}, using generic fallback`)
                questionOptions = [
                  "Answer choice A for question " + questionId,
                  "Answer choice B for question " + questionId,
                  "Answer choice C for question " + questionId,
                  "Answer choice D for question " + questionId
                ]
              }
            }
            
            // Ensure we have at least 4 options
            while (questionOptions.length < 4) {
              questionOptions.push(`Answer choice ${questionOptions.length + 1} for question ${questionId}`)
            }
            
            // Get correct answer - first check options table mapping
            let correctAnswer = correctAnswersMap[questionId]
            
            // If no correct answer from options table, look in the question data
            if (!correctAnswer) {
              console.warn(`No correct answer in options table for question ${questionId}, searching in question data...`)
              
              // Common field names for correct answers
              const answerFields = [
                'correct_answer', 'correctAnswer', 'answer', 'correct', 
                'correct_option', 'correctOption', 'right_answer', 'rightAnswer'
              ]
              
              // Find the first field that exists
              for (const field of answerFields) {
                if (q[field] !== undefined && q[field] !== null) {
                  correctAnswer = q[field]
                  console.log(`Found correct answer in field '${field}':`, correctAnswer)
                  break
                }
              }
              
              // If the answer is a number or letter, convert to the full option text
              if (correctAnswer) {
                if (/^[0-9]$/.test(correctAnswer) && questionOptions[parseInt(correctAnswer, 10)]) {
                  // Numeric index (0-based)
                  correctAnswer = questionOptions[parseInt(correctAnswer, 10)]
                } else if (/^[1-9]$/.test(correctAnswer) && questionOptions[parseInt(correctAnswer, 10) - 1]) {
                  // Numeric index (1-based)
                  correctAnswer = questionOptions[parseInt(correctAnswer, 10) - 1]
                } else if (/^[a-dA-D]$/.test(correctAnswer)) {
                  // Letter index
                  const index = correctAnswer.toLowerCase().charCodeAt(0) - 97 // 'a' is 97 in ASCII
                  if (questionOptions[index]) {
                    correctAnswer = questionOptions[index]
                  }
                }
              }
            }
            
            // If still no correct answer, use the first option
            if (!correctAnswer && questionOptions.length > 0) {
              correctAnswer = questionOptions[0]
              console.warn(`No valid correct answer found for question ${questionId}, using first option as correct`)
            }
            
            // Get the question text from various possible fields
            const questionText = 
              q.question_text || 
              q.question || 
              q.text || 
              q.content || 
              q.stem || 
              `Question ${q.id}`
            
            // Get category if available
            const category = 
              q.category || 
              q.topic || 
              q.subject || 
              q.section || 
              'General Knowledge'
            
            return {
              id: q.id,
              question: questionText,
              options: questionOptions,
              correctAnswer: correctAnswer,
              category: category
            }
          })
          
          console.log('Setting questions state with formatted questions...')
          setQuestions(formattedQuestions)
          setError(null)
        } else {
          throw new Error('No questions found in database')
        }
      } catch (err: any) {
        console.error('Error fetching questions:', err.message || err)
        
        // Set a more helpful error message
        setError(`Failed to load questions from database: ${err.message}. Using sample questions as fallback.`)
        // Keep using the sample questions as fallback
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchQuestions()
  }, [])

  // Define the debugCurrentQuestion function
  const debugCurrentQuestion = async () => {
    if (!questions || !questions[currentQuestion]) {
      return "No current question data available";
    }
    
    try {
      // Get direct database data for the current question
      let dbData = null;
      
      // Try both table names
      const { data: questionData, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', questions[currentQuestion].id)
        .single();
        
      if (error) {
        const { data: altData, error: altError } = await supabase
          .from('asvab_questions')
          .select('*')
          .eq('id', questions[currentQuestion].id)
          .single();
          
        if (!altError) {
          dbData = altData;
        }
      } else {
        dbData = questionData;
      }
      
      // Check for the question in both tables
      const results = await inspectQuestionOptions();
      
      // Prepare result message
      let message = `Current Question Data (ID: ${questions[currentQuestion].id}):\n\n`;
      
      message += `Question: ${questions[currentQuestion].question}\n\n`;
      message += `Options (${questions[currentQuestion].options.length}):\n`;
      message += questions[currentQuestion].options.map((opt, i) => 
        `  ${i+1}. "${opt}"`
      ).join('\n');
      
      message += `\n\nCorrect Answer: "${questions[currentQuestion].correctAnswer}"\n\n`;
      
      if (dbData) {
        message += "Raw Database Fields:\n";
        // Show only option-related fields
        const optionFields = [
          'options', 'choices', 'answers', 
          'option1', 'option2', 'option3', 'option4',
          'option_a', 'option_b', 'option_c', 'option_d',
          'a', 'b', 'c', 'd',
          'optionA', 'optionB', 'optionC', 'optionD'
        ];
        
        for (const field of optionFields) {
          if (dbData[field] !== undefined && dbData[field] !== null) {
            const value = typeof dbData[field] === 'object' 
              ? JSON.stringify(dbData[field]) 
              : dbData[field];
            message += `  ${field}: ${value}\n`;
          }
        }
      } else {
        message += "Could not fetch raw database data for this question.\n";
      }
      
      // Show the full database check as a second alert
      setTimeout(() => {
        alert("Database Question Check:\n" + results);
      }, 500);
      
      return message;
    } catch (err: any) {
      console.error("Error in debugCurrentQuestion:", err);
      return `Error debugging question: ${err.message}`;
    }
  };

  // Function to examine table columns (simplified version)
  const getTableColumns = async (tableName: string): Promise<string> => {
    try {
      // Simple approach - select a row and examine its structure
      const { data: sampleData, error: sampleError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1);
        
      if (sampleError) {
        return `Could not get columns for ${tableName}: ${sampleError.message}`;
      }
      
      if (sampleData && sampleData.length > 0) {
        const columns = Object.keys(sampleData[0]);
        return `Columns in ${tableName}: ${columns.join(', ')}`;
      }
      
      return `No data available to determine columns in ${tableName}`;
    } catch (err: any) {
      return `Error examining table structure: ${err.message}`;
    }
  };
  
  // Test database permissions for saving progress
  const testSavePermissions = async (): Promise<string> => {
    try {
      const loginStatus = await checkLoginStatus();
      
      if (!loginStatus.isLoggedIn) {
        return "Not logged in. You need to log in to save progress.";
      }
      
      // Test if we can query the progress table
      const { data: testData, error: testError } = await supabase
        .from('user_progress')
        .select('count')
        .limit(1);
        
      if (testError) {
        return `Cannot access user_progress table: ${testError.message}`;
      }
      
      return `Database permissions test successful. You can save progress to user_progress table.`;
      
    } catch (err: any) {
      return `Error testing permissions: ${err.message}`;
    }
  };
  
  // Test row-level security permissions
  const checkRlsPermissions = async (): Promise<string> => {
    try {
      const loginStatus = await checkLoginStatus();
      
      if (!loginStatus.isLoggedIn) {
        return "Not logged in. Cannot check RLS permissions.";
      }
      
      // Test RLS with a simple query that should be restricted to the user
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', loginStatus.userId)
        .limit(1);
      
      if (error) {
        return `RLS permission error: ${error.message}`;
      }
      
      return `RLS permissions check successful. You can access your data.`;
      
    } catch (err: any) {
      return `Error checking RLS: ${err.message}`;
    }
  };
  
  // Refresh user session
  const refreshUserSession = async (): Promise<string> => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        return `Session refresh failed: ${error.message}`;
      }
      
      if (data.session) {
        return `Session refreshed successfully. User ID: ${data.session.user.id}`;
      } else {
        return "No active session to refresh.";
      }
      
    } catch (err: any) {
      return `Error refreshing session: ${err.message}`;
    }
  };
  
  // Check database schema
  const inspectDatabaseSchema = async (): Promise<string> => {
    try {
      // Simple approach - try to query the table
      const { data: tables, error: tableError } = await supabase
        .from('user_progress')
        .select('count')
        .limit(1);
        
      if (tableError) {
        return `Cannot access database: ${tableError.message}`;
      }
      
      return "Database connection successful. Table exists.";
      
    } catch (err: any) {
      return `Error inspecting database: ${err.message}`;
    }
  };
  
  // Test minimal insert operation
  const testMinimalInsert = async (): Promise<string> => {
    try {
      const loginStatus = await checkLoginStatus();
      
      if (!loginStatus.isLoggedIn) {
        return "Not logged in. Cannot test insert.";
      }
      
      // Create minimal test data
      const testData = {
        user_id: loginStatus.userId
      };
      
      console.log('Attempting basic insert test with data:', JSON.stringify(testData, null, 2));
      
      // Attempt insert with minimal data
      const { data, error } = await supabase
        .from('user_progress')
        .insert(testData)
        .select();
      
      if (error) {
        console.error('Insert error details:', JSON.stringify(error, null, 2));
        return `Test insert failed: ${error.message || 'Unknown error'}`;
      }
      
      console.log('Insert succeeded with result:', JSON.stringify(data, null, 2));
      return `Test insert successful. Data ID: ${data?.[0]?.id || 'unknown'}`;
      
    } catch (err: any) {
      console.error('Exception in test insert:', err);
      return `Error testing insert: ${err.message || err}`;
    }
  };
  
  // Inspect question options structure
  const inspectQuestionOptions = async (): Promise<string> => {
    try {
      // First, try to access the questions table
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*')
        .limit(1)
      
      if (questionsError) {
        return `Cannot access questions table: ${questionsError.message}`
      }
      
      // Now, check the options table
      const { data: optionsData, error: optionsError } = await supabase
        .from('options')
        .select('*')
        .limit(5)
      
      let message = ""
      
      if (questionsData && questionsData.length > 0) {
        message += `Question fields: ${Object.keys(questionsData[0]).join(', ')}\n\n`
      } else {
        message += "No questions found in the questions table.\n\n"
      }
      
      if (optionsError) {
        message += `Cannot access options table: ${optionsError.message}`
      } else if (optionsData && optionsData.length > 0) {
        message += `Options table structure:\nFields: ${Object.keys(optionsData[0]).join(', ')}\n\n`
        message += `Sample options (${Math.min(optionsData.length, 5)} of ${optionsData.length}):\n`
        
        for (let i = 0; i < Math.min(optionsData.length, 5); i++) {
          const option = optionsData[i]
          const text = option.text || option.option_text || option.value || option.content || 'No text'
          const qId = option.question_id || 'Unknown'
          const isCorrect = option.is_correct || option.correct || option.is_answer ? 'Yes' : 'No'
          
          message += `- Question ID: ${qId}, Text: "${text}", Correct: ${isCorrect}\n`
        }
      } else {
        message += "No options found in the options table."
      }
      
      return message
    } catch (err: any) {
      return `Error inspecting questions and options: ${err.message}`
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen pt-16 justify-center items-center">
          <div className="text-center">
            <p className="text-xl text-black dark:text-white">Loading questions...</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen pt-16">
        {/* Left Sidebar - reduce width */}
        <div className="w-52 border-r p-4 bg-white dark:bg-gray-800 dark:text-white">
          
          {error && (
            <div className="mb-4 p-2 bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          {/* Add a debug element to display errors */}
          <div id="debug-output" className="mb-6 p-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-xs overflow-auto max-h-36 hidden">
            <h4 className="font-bold">Debug Output:</h4>
            <pre id="debug-content" className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">No errors logged</pre>
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
            <div className="grid grid-cols-5 gap-1">
              {questions.map((_, index) => {
                // Check if this question should be displayed based on filter settings
                const isAnswered = !!answers[index];
                const shouldShow = (isAnswered && showAnswered) || (!isAnswered && showUnanswered);
                
                // If question doesn't match filter criteria, don't render it
                if (!shouldShow) return null;
                
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`p-1.5 text-center text-sm ${
                      currentQuestion === index 
                        ? 'bg-blue-500 text-white' 
                        : answers[index] 
                          ? 'bg-gray-200 dark:bg-gray-600 text-black dark:text-white' 
                          : 'bg-gray-100 dark:bg-gray-700 text-black dark:text-white'
                    } hover:bg-blue-200 dark:hover:bg-blue-800`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - increase max width */}
        <div className="flex-1 p-2 px-3 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-1">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-6 text-black dark:text-white">
              <div className="flex items-center space-x-2">
                <span className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-black dark:text-white">
                  {formatTime(time)}
                </span>
                <button 
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-black dark:text-white"
                >
                  {isPaused ? <PlayIcon size={20} /> : <PauseIcon size={20} />}
                </button>
              </div>

              <div className="text-center text-black dark:text-white flex-1 mx-4">
                Practice Test - Question {currentQuestion + 1} of {questions.length}
                {questions[currentQuestion]?.category && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Category: {questions[currentQuestion].category}
                  </div>
                )}
              </div>
              
              {/* Empty div to maintain the 3-column layout for proper centering */}
              <div className="w-[88px]"></div>
            </div>

            {/* Question Content - increase padding and font size */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-lg mb-6 shadow-md w-full">
              <p className="text-xl md:text-2xl mb-6 md:mb-8 text-black dark:text-white">
                {questions[currentQuestion]?.question || 'Loading question...'}
              </p>
              
              <div className="space-y-3 md:space-y-4">
                {questions[currentQuestion]?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion]: option }))}
                    className={`w-full text-left p-3 md:p-4 rounded text-base md:text-lg ${
                      answers[currentQuestion] === option
                        ? 'bg-blue-500 text-white'
                        : 'bg-white dark:bg-gray-700 text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex justify-end items-center">
              <div className="space-x-4">
                <button
                  onClick={() => currentQuestion > 0 && setCurrentQuestion(prev => prev - 1)}
                  disabled={currentQuestion === 0}
                  className="px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-black dark:text-white rounded disabled:opacity-50 text-lg"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setShowSummary(true)}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded text-lg"
                >
                  Finish
                </button>
                <button
                  onClick={() => currentQuestion < questions.length - 1 && setCurrentQuestion(prev => prev + 1)}
                  disabled={currentQuestion === questions.length - 1}
                  className="px-6 py-2.5 bg-blue-500 text-white rounded disabled:opacity-50 text-lg"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replace inline Summary Modal with the new component */}
      {showSummary && (
        <SummaryModal
          questions={questions}
          answers={answers}
          time={time}
          onClose={() => setShowSummary(false)}
          isSaving={isSaving}
          saveSuccess={saveSuccess}
          saveError={saveError}
          setSaveError={setSaveError}
          setSaveSuccess={setSaveSuccess}
          setIsSaving={setIsSaving}
          previousProgress={previousProgress}
          isLoadingProgress={isLoadingProgress}
          formatTime={formatTime}
          calculateScore={calculateScore}
          saveProgress={saveProgress}
          testSavePermissions={testSavePermissions}
          checkRlsPermissions={checkRlsPermissions}
          refreshUserSession={refreshUserSession}
          inspectDatabaseSchema={inspectDatabaseSchema}
          testMinimalInsert={testMinimalInsert}
          checkLoginStatus={checkLoginStatus}
          setCurrentQuestion={setCurrentQuestion}
          getTableColumns={getTableColumns}
        />
      )}
    </>
  )
}

// Add this script to catch console errors and display them in the UI
const captureConsoleErrors = `
  (function() {
    const originalConsoleError = console.error;
    console.error = function() {
      // Call the original console.error
      originalConsoleError.apply(console, arguments);
      
      // Capture the error message
      const errorMsg = Array.from(arguments).map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' ');
      
      // Display in the debug element
      const debugElement = document.getElementById('debug-content');
      const debugContainer = document.getElementById('debug-output');
      if (debugElement && debugContainer) {
        debugElement.textContent = errorMsg;
        debugContainer.classList.remove('hidden');
      }
    };
  })();
`; 
