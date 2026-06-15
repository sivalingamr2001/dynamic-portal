import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react"

import { loginApi } from "@/api/authApi"
import type { RegionDetailsDto } from "@/api/allocationApi"
import useSessionStorage from "@/hooks/useSessionStorage"

const STORAGE_KEY = "jan_AP_user"

export type PortalUserRole = "Admin" | "Hod" | "User"

export interface AuthUser {
    username: string
    name: string
    role: PortalUserRole
    region: string
    subRegion: string
}

type AuthContextType = {
    currentUser: AuthUser | null
    currentUserRole: PortalUserRole | null
    currentRegion: RegionDetailsDto | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (username: string, password?: string, expireInMinutes?: number) => Promise<void>
    logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const { get, set, remove } = useSessionStorage()

    const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
    const [currentRegion, setCurrentRegion] = useState<RegionDetailsDto | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const storedUser = get(STORAGE_KEY) as AuthUser | null
        if (storedUser) {
            setCurrentUser(storedUser)
            setCurrentRegion({
                region: storedUser.region,
                subRegion: storedUser.subRegion,
            })
        }
        setIsLoading(false)
    }, [get])

    const login = async (username: string, password?: string, expireInMinutes = 30) => {
        setIsLoading(true)
        try {
            const regionDetails = await loginApi(username, password)

            const normalizedUsername = username.trim().toUpperCase()
            const role: PortalUserRole = normalizedUsername === "JANHPL" ? "Hod" : "User"

            const userDetails: AuthUser = {
                username: username.trim(),
                name: username.trim(),
                role,
                region: regionDetails.region,
                subRegion: regionDetails.subRegion,
            }

            set(STORAGE_KEY, userDetails, expireInMinutes)
            set("isAuthenticated", true)
            setCurrentUser(userDetails)
            setCurrentRegion(regionDetails)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        setIsLoading(true)
        try {
            remove(STORAGE_KEY)
            setCurrentUser(null)
            setCurrentRegion(null)
        } finally {
            setIsLoading(false)
        }
    }

    const value = useMemo(
        () => ({
            currentUser,
            currentRegion,
            currentUserRole: currentUser?.role ?? null,
            isAuthenticated: !!currentUser,
            isLoading,
            login,
            logout,
        }),
        [currentUser, currentRegion, isLoading]
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
