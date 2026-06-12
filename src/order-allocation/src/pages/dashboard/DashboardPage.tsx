import { Button } from "@/components/ui/button"
import useSessionStorage from "@/hooks/useSessionStorage"
import { useNavigate } from "react-router-dom"

export const DashboardPage = () => {
  const { clear } = useSessionStorage()
  const navigate = useNavigate()

  const handleLogout = () => {
    clear()
    navigate("/login")
  }

  return <div>
    <h1>Dashboard</h1>
    <Button onClick={handleLogout}>Logout</Button>
  </div>
}
