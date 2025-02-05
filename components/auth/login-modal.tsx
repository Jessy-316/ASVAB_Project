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

export function LoginModal() {
  const [isSignUp, setIsSignUp] = useState(false)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          size="sm"
          className="bg-[#000A1F] hover:bg-white hover:text-[#000A1F] text-white font-semibold rounded-lg transition-colors duration-200 border-2 border-[#000A1F]"
        >
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] z-50">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create an Account' : 'Welcome Back'}</DialogTitle>
          <DialogDescription>
            {isSignUp ? 'Sign up to track your progress and save your scores.' : 'Login to access your account and continue your preparation.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {isSignUp && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="Choose a username" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" type="text" placeholder="First name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" type="text" placeholder="Last name" />
                </div>
              </div>
            </>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter your password" />
          </div>
          {isSignUp && (
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" type="password" placeholder="Confirm your password" />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <Button 
            className="w-full bg-[#000A1F] hover:bg-white hover:text-[#000A1F] text-white font-semibold rounded-lg transition-colors duration-200 border-2 border-[#000A1F]"
          >
            {isSignUp ? 'Sign Up' : 'Login'}
          </Button>
          <div className="text-center text-sm">
            <span className="text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-1 text-[#000A1F] hover:text-[#00061A] font-medium transition-all"
            >
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
