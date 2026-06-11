import { Outlet } from "react-router-dom"

export const AppLayout = () => {
  return (
    <>
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0">
        <Outlet />
      </main>
    </>
  )
}
