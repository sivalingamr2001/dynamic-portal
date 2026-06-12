"use client"

import { Button } from "@/components/ui/button"
import { Bell, Mail } from "lucide-react"
import { MobileNav } from "./mobile-nav"

type AppHeaderProps = {
    title: string
    description: string
    onMenuClick: () => void;
}

export const AppHeader = ({ title, description }: AppHeaderProps) => {
    return (
        <header className="w-full">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1">
                    <MobileNav />

                    <div key={title} className="flex flex-col min-w-0 animate-slide-in-down duration-300">
                        <h1 className="text-sm font-semibold text-foreground truncate">{title}</h1>
                        {description && (
                            <span className="text-xs text-muted-foreground truncate max-w-sm">
                                {description}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-1.5 md:gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-secondary transition-all duration-300 hover:scale-110 h-8 w-8"
                    >
                        <Mail className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative hover:bg-secondary transition-all duration-300 hover:scale-110 h-8 w-8"
                    >
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-destructive rounded-full animate-pulse" />
                    </Button>


                </div>
            </div>
        </header>
    )
}
