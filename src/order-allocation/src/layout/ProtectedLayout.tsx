import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Loader } from "@/components/Loader"

export const ProtectedLayout = () => {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate("/login", { replace: true })
        }
    }, [isAuthenticated, isLoading, navigate])

    if (isLoading) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-background">
                <Loader isText={true} />
            </div>
        )
    }

    return isAuthenticated ? <Outlet /> : null
}
