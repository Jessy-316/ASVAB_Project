"use client"

import { useEffect, useState } from 'react'
import { supabase } from "@/supabase/supabase"
import { Button } from "@/components/ui/button"
import { LoginModal } from "@/components/auth/login-modal"

export function UserNav() {
  const [user, setUser] = useState<any>(null)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const firstName = session.user.user_metadata.first_name
        const lastName = session.user.user_metadata.last_name
        setUserName(firstName ? `${firstName} ${lastName}` : session.user.email ?? 'User')
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        const firstName = session.user.user_metadata.first_name
        const lastName = session.user.user_metadata.last_name
        setUserName(firstName ? `${firstName} ${lastName}` : session.user.email ?? 'User')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div>
      {user ? (
        <div className="flex items-center gap-4">
          <span>Welcome, {userName}</span>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
          >
            Sign Out
          </Button>
        </div>
      ) : (
        <LoginModal />
      )}
    </div>
  )
} 
