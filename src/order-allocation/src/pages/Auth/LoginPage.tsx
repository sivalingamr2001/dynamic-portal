import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useLoader } from '@/hooks/useLoader'
import { Package, ArrowRight } from 'lucide-react'

// Official Shadcn Component UI Imports
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader } from '@/components/Loader'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

export const LoginPage: React.FC = () => {
    const { login } = useAuth()
    const { loading, withLoader } = useLoader()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [localError, setLocalError] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLocalError('')

        try {
            await withLoader(async () => {
                await login(email, password)
            })
            navigate('/dashboard')
        } catch (err) {
            setLocalError(err instanceof Error ? err.message : 'Login failed')
        }
    }

    return (
        // Base viewport layer centering everything perfectly
        <div className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">

            {/* Decorative blurred backdrop aura */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />

            {/* Standardized Single-Wrapper Card layout Container */}
            <Card className="w-full max-w-md bg-card text-card-foreground border-border shadow-xl relative z-10 overflow-hidden">

                {/* Brand Header block integrated natively into Shadcn header patterns */}
                <CardHeader className="pt-8 pb-4 flex flex-col items-center text-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center shadow-xs">
                        <Package className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1.5">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">Sign in to B3</h1>
                        <p className="text-sm text-muted-foreground font-medium">
                            Enter your corporate credentials below
                        </p>
                    </div>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 pb-6">

                        {localError && (
                            <Alert variant="destructive" className="bg-destructive/5 text-destructive border-destructive/10 rounded-xl">
                                <AlertDescription className="text-xs font-medium">
                                    {localError}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Email form controller segment */}
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold tracking-wide text-foreground/80">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                disabled={loading}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                className="h-11 border-input bg-background text-foreground focus-visible:ring-ring rounded-xl transition-all w-full"
                                required
                            />
                        </div>

                        {/* Password form controller segment */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="text-xs font-semibold tracking-wide text-foreground/80">
                                    Password
                                </Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                disabled={loading}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="h-11 border-input bg-background text-foreground focus-visible:ring-ring rounded-xl transition-all w-full"
                                required
                            />
                        </div>

                        {/* Submit Action Block */}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl transition-all shadow-md shadow-primary/10 flex items-center justify-center gap-2 group mt-2"
                        >
                            {loading ? (
                                <>
                                    <Loader isText={false} />
                                    <span>Verifying account...</span>
                                </>
                            ) : (
                                <>
                                    <span>Sign in</span>
                                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                                </>
                            )}
                        </Button>

                    </CardContent>
                </form>

                {/* Unified Portal Metadata Footer Row */}
                <CardFooter className="pt-4 pb-6 border-t border-border/40 justify-center bg-muted/20">
                    <p className="text-[11px] font-medium text-muted-foreground tracking-tight">
                        Order Allocation Portal v1.0.0 — Protected Endpoint
                    </p>
                </CardFooter>

            </Card>
        </div>
    )
}
