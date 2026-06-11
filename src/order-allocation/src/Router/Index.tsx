import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routesConfig } from "./routerConfig"

const router = createBrowserRouter(routesConfig, {
  basename: "/portal",
})

export const Router = () => <RouterProvider router={router} />
