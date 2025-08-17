// lib/apollo.ts
import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { nhost } from './nhost'

// 1️⃣ HTTP link to Hasura/Nhost GraphQL
const httpLink = new HttpLink({
  uri: `https://${import.meta.env.VITE_NHOST_SUBDOMAIN}.nhost.run/v1/graphql`,
})

// 2️⃣ Auth link to automatically send JWT token
const authLink = setContext((_, { headers }) => {
  const token = nhost.auth.getAccessToken() // gets current token (persisted in localStorage)
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// 3️⃣ Apollo client
export const apolloClient = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
})
