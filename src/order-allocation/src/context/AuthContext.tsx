import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import useSessionStorage from "@/hooks/useSessionStorage"
import type { UserDetails } from "@/api/types"
import { loginApi, logoutApi } from "@/api/authApi"

const STORAGE_KEY = "jan_AP_user"

type AuthContextType = {
    currentUser: UserDetails | null
    currentUserRole: UserDetails["role"] | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (username: string, password?: string, expireInMinutes?: number) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { get, set, remove } = useSessionStorage()

    const [currentUser, setCurrentUser] = useState<UserDetails | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const storedUser = get(STORAGE_KEY) as UserDetails | null
        if (storedUser) {
            setCurrentUser(storedUser)
        }
        setIsLoading(false)
    }, [get])

    const login = async (username: string, password?: string, expireInMinutes = 30) => {
        setIsLoading(true)
        try {
            const userDetails = await loginApi(username, password)

            set(STORAGE_KEY, userDetails, expireInMinutes)
            set("isAuthenticated", true)
            setCurrentUser(userDetails)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        setIsLoading(true)
        try {
            await logoutApi()
        } catch (error) {
            console.error("Logout endpoint failed:", error)
        } finally {
            remove(STORAGE_KEY)
            setCurrentUser(null)
            setIsLoading(false)
        }
    }

    const value = useMemo(
        () => ({
            currentUser,
            currentUserRole: currentUser?.role ?? 'user',
            isAuthenticated: !!currentUser,
            isLoading,
            login,
            logout,
        }),
        [currentUser, isLoading]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context
}
