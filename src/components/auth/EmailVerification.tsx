import React from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import { useUserData, useSignOut } from '@nhost/react'

const EmailVerification: React.FC = () => {
  const user = useUserData()
  const { signOut } = useSignOut()

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-lg shadow-xl p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-400 mb-2">
            We've sent a verification link to
          </p>
          <p className="text-blue-400 font-medium mb-6">{user?.email}</p>

          <p className="text-gray-300 text-sm mb-4">
            Please check your inbox and click the link to activate your account.
          </p>
          
          <p className="text-gray-400 text-xs mb-6">
            <span>If you don't see it, check your spam folder.</span>
          </p>

          <div className="flex items-center justify-center space-x-2 text-green-400 text-sm mb-6">
            <CheckCircle className="h-4 w-4" />
            <span>Email sent successfully!</span>
          </div>

        
        </div>
      </div>
    </div>
  )
}

export default EmailVerification