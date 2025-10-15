import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Keycloak, { KeycloakInstance } from 'keycloak-js'

export type AuthState = {
  keycloak: KeycloakInstance | null
  initialized: boolean
  authenticated: boolean
  token?: string
  username?: string
}

const AuthCtx = createContext<AuthState>({ keycloak: null, initialized: false, authenticated: false })

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({ keycloak: null, initialized: false, authenticated: false })

  useEffect(() => {
    const keycloak = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    })

    keycloak
      .init({ onLoad: 'login-required', pkceMethod: 'S256', checkLoginIframe: false })
      .then((authenticated) => {
        setState({
          keycloak,
          initialized: true,
          authenticated,
          token: keycloak.token,
          username: keycloak.tokenParsed?.preferred_username as string | undefined,
        })

        // Refresh token 30s before expiry
        const refreshInterval = setInterval(() => {
          keycloak
            .updateToken(30)
            .then((refreshed) => {
              if (refreshed) {
                setState((prev) => ({ ...prev, token: keycloak.token }))
              }
            })
            .catch(() => keycloak.login())
        }, 20000)
        ;(window as any).__kc_refresh = refreshInterval
      })
      .catch((e) => {
        console.error('Keycloak init failed', e)
      })

    return () => {
      const id = (window as any).__kc_refresh
      if (id) clearInterval(id)
    }
  }, [])

  const value = useMemo(() => state, [state])

  if (!state.initialized) {
    return <div style={{ padding: 24 }}>Initializing authentication...</div>
  }

  if (!state.authenticated) {
    return <div style={{ padding: 24 }}>Redirecting to login...</div>
  }

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
