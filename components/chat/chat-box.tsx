"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, Send } from "lucide-react"
import { cn } from "@/lib/utils"

export function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([])
  const [input, setInput] = useState("")

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setMessages([...messages, { text: input, isUser: true }])
    setInput("")
    // Here you would integrate with your AI service
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div 
        className={cn(
          "fixed right-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-300",
          isOpen && "translate-x-[350px]"
        )}
      >
        <Button
          className="h-32 w-10 rounded-l-lg rounded-r-none shadow-lg flex flex-col items-center justify-center gap-2 bg-primary hover:translate-x-1 transition-transform"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MessageCircle className="h-5 w-5" />
          <span className="vertical-text text-xs font-medium tracking-wider">
            {isOpen ? "CLOSE" : "CHAT"}
          </span>
        </Button>
      </div>
      
      {/* Chat Panel */}
      <div 
        className={cn(
          "fixed top-0 right-0 h-full w-[350px] bg-background shadow-lg transform transition-transform duration-300 ease-in-out z-40",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="h-16 border-b flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">ASVAB Assistant</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Container */}
        <div className="flex flex-col h-[calc(100%-8rem)] p-4 overflow-y-auto scrollbar-hide">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8">
              <p>Ask any questions about ASVAB test preparation, and I'll help you out!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex",
                    msg.isUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 max-w-[85%] shadow-sm",
                      msg.isUser 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted"
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Form */}
        <form 
          onSubmit={sendMessage} 
          className="h-16 border-t p-2 flex items-center gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>

      {/* Backdrop on mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
} 
