"use client"

import { useState } from "react"
import { User, Settings, LogOut } from "lucide-react" // Removed Bell icon
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Removed Badge import
import type { TabType } from "@/components/mobile-app"

interface AppHeaderProps {
  username?: string
  setActiveTab?: (tab: TabType) => void
}

export function AppHeader({ username = "John Doe", setActiveTab }: AppHeaderProps) {
  // In a real app, this would come from authentication
  const [user] = useState({
    name: username,
    email: "admin@traffic.com",
  })

  // Removed mock notification count

  // Navigate to settings page
  const navigateToSettings = () => {
    if (setActiveTab) {
      setActiveTab("settings")
    }
  }

  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="text-sm font-medium">
          Welcome, <span className="text-primary">{user.name}</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Removed Notifications Dropdown */}

          {/* User Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-bold">
                <User className="mr-2 h-4 w-4" />
                <span>My Account</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={navigateToSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
