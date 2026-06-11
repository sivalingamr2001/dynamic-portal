import { Loader } from "@/components/Loader"
import { Suspense } from "react"

export const withSuspense = (Component: React.ComponentType) => {
  return (
    <Suspense fallback={<Loader />}>
      <Component />
    </Suspense>
  )
}
