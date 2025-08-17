import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { NhostProvider } from '@nhost/react'
import { NhostApolloProvider } from '@nhost/react-apollo';
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'

import './index.css'
import { nhost } from './lib/nhost'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NhostProvider nhost={nhost}>
      <NhostApolloProvider nhost={nhost}>
        <AuthProvider>
        <App />
        </AuthProvider>
      </NhostApolloProvider>
    </NhostProvider>
  </StrictMode>
)