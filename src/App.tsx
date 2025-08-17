import React from 'react'
import { useAuthenticationStatus, useUserData } from '@nhost/react'
import AuthPage from './components/auth/AuthPage'
import ChatInterface from './components/chat/ChatInterface'
import { ChatProvider } from './contexts/ChatContext'

function App() {
  const { isLoading, isAuthenticated } = useAuthenticationStatus()
  const user = useUserData()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    // Ensure email verification before allowing chat
    if (!user?.emailVerified) {
      return <div className="min-h-screen flex items-center justify-center text-white">
        Please verify your email to continue.
      </div>
    }

    return (
      <ChatProvider>
        <ChatInterface />
      </ChatProvider>
    )
  }

  return <AuthPage />
}

export default App
