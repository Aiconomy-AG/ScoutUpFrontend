import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { removeStoredToken, requestJson, setStoredToken } from '../api/apiClient'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [authChecked, setAuthChecked] = useState(false)

    useEffect(() => {
        let ignore = false

        const loadCurrentUser = async () => {
            try {
                const user = await requestJson('/me')

                if (!ignore) {
                    setCurrentUser(user)
                }
            } catch {
                removeStoredToken()

                if (!ignore) {
                    setCurrentUser(null)
                }
            } finally {
                if (!ignore) {
                    setAuthChecked(true)
                }
            }
        }

        loadCurrentUser()

        return () => {
            ignore = true
        }
    }, [])

    const login = async (loginData) => {
        const response = await requestJson('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(loginData),
        })

        setStoredToken(response.token)
        setCurrentUser(response.user)

        return response.user
    }

    const register = async (registerData) => {
        const response = await requestJson('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(registerData),
        })

        return response
    }

    const logout = async () => {
        try {
            await requestJson('/logout', {
                method: 'POST',
            })
        } catch (error) {
            console.error(error)
        } finally {
            removeStoredToken()
            setCurrentUser(null)
        }
    }

    const value = useMemo(
        () => ({
            currentUser,
            authChecked,
            isAuthenticated: Boolean(currentUser),
            isAdmin: currentUser?.role === 'admin',
            login,
            register,
            logout,
        }),
        [currentUser, authChecked],
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider')
    }

    return context
}