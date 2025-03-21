"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/supabase/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

export function LoginModal() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const resetForm = () => {
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setFirstName("")
    setLastName("")
    setUsername("")
    setError(null)
    setSuccess(null)
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password")
      return
    }

    try {
      setLoading(true)
      setError(null)

      console.log("Attempting login with:", { email })
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Login response:", data ? "Data received" : "No data", 
                 "Error:", loginError ? loginError.message : "No error")

      if (loginError) {
        throw loginError
      }

      if (data?.user) {
        // Refresh the session to ensure it's properly set
        await supabase.auth.refreshSession()
        
        // Get session to verify it's working
        const { data: sessionData } = await supabase.auth.getSession()
        console.log("Session after login:", 
                   sessionData.session ? "Active session" : "No active session")
                   
        setSuccess("Login successful!")
        // Close the dialog after a short delay
        setTimeout(() => {
          setIsOpen(false)
          resetForm()
          // Reload the page to ensure all components recognize the login state
          window.location.reload()
        }, 1500)
      } else {
        setError("Login succeeded but no user data was returned. Please try again.")
      }
    } catch (err: any) {
      console.error("Login error:", err)
      setError(err.message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            username: username,
          },
        },
      })

      if (signUpError) {
        throw signUpError
      }

      if (data?.user) {
        setSuccess("Account created successfully! Please check your email for verification.")
      }
    } catch (err: any) {
      console.error("Signup error:", err)
      setError(err.message || "Failed to create account. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isSignUp) {
      handleSignUp()
    } else {
      handleLogin()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          size="sm"
          className="bg-[#000A1F] hover:bg-white hover:text-[#000A1F] text-white font-semibold rounded-lg transition-colors duration-200 border-2 border-[#000A1F]"
          onClick={() => {
            resetForm()
            setIsOpen(true)
          }}
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-50 bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-white">{isSignUp ? 'Create an Account' : 'Welcome Back'}</DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-300">
            {isSignUp ? 'Sign up to track your progress and save your scores.' : 'Login to access your account and continue your preparation.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="bg-green-50 border-green-200 text-green-800 py-2 dark:bg-green-900 dark:border-green-800 dark:text-green-100">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          
          {isSignUp && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-200">Username</Label>
                <Input 
                  id="username" 
                  type="text" 
                  placeholder="Choose a username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-200">First Name</Label>
                  <Input 
                    id="firstName" 
                    type="text" 
                    placeholder="First name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-200">Last Name</Label>
                  <Input 
                    id="lastName" 
                    type="text" 
                    placeholder="Last name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email <span className="text-red-500">*</span></Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="Enter your email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password <span className="text-red-500">*</span></Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="confirm-password" className="text-gray-700 dark:text-gray-200">Confirm Password <span className="text-red-500">*</span></Label>
              <Input 
                id="confirm-password" 
                type="password" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}
          
          <div className="flex flex-col gap-4 pt-2">
            <Button 
              type="submit"
              disabled={loading}
              className="w-full bg-[#000A1F] hover:bg-white hover:text-[#000A1F] text-white font-semibold rounded-lg transition-colors duration-200 border-2 border-[#000A1F]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? 'Creating Account...' : 'Logging in...'}
                </>
              ) : (
                isSignUp ? 'Sign Up' : 'Login'
              )}
            </Button>
            
            {!isSignUp && (
              <button 
                type="button"
                onClick={() => setError("Password reset functionality will be added soon.")}
                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-center"
              >
                Forgot password?
              </button>
            )}
            
            <div className="text-center text-sm">
              <span className="text-gray-600 dark:text-gray-300">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setError(null)
                  setSuccess(null)
                }}
                className="ml-1 text-[#000A1F] hover:text-[#00061A] dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-all"
              >
                {isSignUp ? 'Login' : 'Sign Up'}
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
