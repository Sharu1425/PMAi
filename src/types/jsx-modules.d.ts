import type React from "react"

declare module "*.jsx" {
  const Component: React.ComponentType<any>
  export default Component
}

// Google OAuth types
declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string
            scope: string
            callback: (response: any) => void
          }) => {
            requestAccessToken: () => void
          }
        }
      }
    }
  }
}

// Vite environment types
interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

export {}


