import { NhostClient } from '@nhost/nhost-js'

// ✅ Initialize Nhost client using environment variables
export const nhost = new NhostClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION,
})

