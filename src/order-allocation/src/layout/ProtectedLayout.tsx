import useSessionStorage from "@/hooks/useSessionStorage"
import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"

export const ProtectedLayout = () => {
    const { get } = useSessionStorage()
    const isAuthenticated = get("isAuthenticated") === "true"
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login")
        }
    }, [isAuthenticated])

    return (
        <div>
            {isAuthenticated ? (
                <Outlet />
            ) : (
                <div>Please log in to access this page.</div>
            )}
        </div>
    )
}
