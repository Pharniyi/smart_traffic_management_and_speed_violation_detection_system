"use client"

import type React from "react"

import { Home, AlertTriangle, Settings } from "lucide-react" // Removed BarChart2 icon
import { cn } from "@/lib/utils"
import type { TabType } from "@/components/mobile-app"

interface BottomNavigationProps {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="flex justify-around items-center h-16 max-w-[420px] mx-auto">
        <NavItem
          icon={<Home size={22} />}
          label="Home"
          isActive={activeTab === "home"}
          onClick={() => setActiveTab("home")}
        />
        <NavItem
          icon={<AlertTriangle size={22} />}
          label="Violations"
          isActive={activeTab === "violations"}
          onClick={() => setActiveTab("violations")}
        />
        {/* Removed Camera NavItem */}
        <NavItem
          icon={<Settings size={22} />}
          label="Settings"
          isActive={activeTab === "settings"}
          onClick={() => setActiveTab("settings")}
        />
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
}

function NavItem({ icon, label, isActive, onClick }: NavItemProps) {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center w-full h-full",
        isActive ? "text-primary" : "text-muted-foreground",
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </button>
  )
}
