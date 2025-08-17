import React, { createContext, useContext, ReactNode,useState } from 'react'
import { useSignInEmailPassword, useSignUpEmailPassword, useSignOut, useUserData } from '@nhost/react'
import EmailVerification from "../components/auth/EmailVerification"
interface AuthContextType {
  user: any
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const user = useUserData()
  const { signInEmailPassword, isLoading: signInLoading } = useSignInEmailPassword()
  const { signUpEmailPassword, isLoading: signUpLoading } = useSignUpEmailPassword()
  const { signOut } = useSignOut()
  const[signedUp,setSignedUp]=useState(false)

  const login = async (email: string, password: string): Promise<void> => {
    const result = await signInEmailPassword(email, password)
    if (result.error) {
      throw new Error(result.error.message)
    }
  }

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    const result = await signUpEmailPassword(email, password, {
      displayName: name,
    })

    if(!result.error){
      setSignedUp(true);
    }

    if(signedUp){
      return <EmailVerification />
    }
    if (result.error) {
      throw new Error(result.error.message)
    }
  }

  const logout = async() => {
    await signOut()
  }

  return (
    <AuthContext.Provider value={{
      user,
      isLoading: signInLoading || signUpLoading,
      login,
      signup,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}