import { Loader } from "@/components/Loader"
import { Button } from "@/components/ui/button"
import { useLoader } from "@/hooks/useLoader"
import { useSessionStorage } from "@/hooks/useSessionStorage"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const LoginPage = () => {
  const { loading, withLoader } = useLoader()
  const { set, get } = useSessionStorage()
  const navigate = useNavigate()

  useEffect(() => {
    if (get("isAuthenticated") === "true") {
      navigate("/dashboard")
    }
  }, [])

  const login = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }

  const handleSubmit = async () => {
    await withLoader(() => login())
    set("isAuthenticated", "true", 3600)
    navigate("/dashboard")
  }

  const handleLogout = () => {
    set("isAuthenticated", "false")
    navigate("/login")
  }

  return (
    <div>
      {loading ? <Loader /> : null}
      <Button onClick={handleSubmit}>Login</Button>
    </div>
  )
}
