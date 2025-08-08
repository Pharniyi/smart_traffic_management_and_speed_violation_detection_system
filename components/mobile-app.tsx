"use client"

import { useState } from "react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { HomeScreen } from "@/components/screens/home-screen"
// import { ReportsScreen } from "@/components/screens/reports-screen"
import { ViolationLogScreen } from "@/components/screens/violation-log-screen"
import { SettingsScreen } from "@/components/screens/settings-screen" // Removed LiveCameraScreen import
import { AppHeader } from "@/components/app-header"

export type TabType = "home" | "violations" | "settings" // Removed "camera"

export function MobileApp() {
  const [activeTab, setActiveTab] = useState<TabType>("home")

  return (
    <div className="flex flex-col h-full bg-background">
      <AppHeader username="Traffic Admin" setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto pb-20">
        {activeTab === "home" && <HomeScreen />}
        {/* {activeTab === "reports" && <ReportsScreen />} */}
        {activeTab === "violations" && <ViolationLogScreen />}
        {/* Removed LiveCameraScreen rendering */}
        {activeTab === "settings" && <SettingsScreen />}
      </main>
      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  )
}
