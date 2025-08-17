import React, { useState } from 'react'
import { useUserData } from '@nhost/react'
import LoginForm from './LoginForm'
import SignupForm from './SignupForm'
import EmailVerification from './EmailVerification'

const AuthPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'signup' | 'verify'>('login')
  const user = useUserData()

  // Show verification if user exists but not verified OR if explicitly set to verify
  if ((user && !user.emailVerified) || currentView === 'verify') {
    return <EmailVerification />
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">ChatBot AI</h1>
            <p className="text-gray-400">Your intelligent conversation partner</p>
          </div>

          <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setCurrentView('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentView === 'login'
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setCurrentView('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                currentView === 'signup'
                  ? 'bg-gray-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {currentView === 'login' ? (
            <LoginForm onSwitchToSignup={() => setCurrentView('signup')} />
          ) : (
            <SignupForm 
              onSwitchToLogin={() => setCurrentView('login')} 
              onSignupSuccess={() => setCurrentView('verify')}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage