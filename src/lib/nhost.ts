import { NhostClient } from '@nhost/nhost-js'

// ✅ Initialize Nhost client using environment variables
export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION,
})

// Debugging
console.log('Nhost Subdomain:', import.meta.env.VITE_NHOST_SUBDOMAIN)
console.log('Nhost Region:', import.meta.env.VITE_NHOST_REGION)
console.log('getSession function:', nhost.auth.getSession)
