"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

// Mock road data
const roads = [
  { id: 1, name: "Lane 1", speedLimit: 20 },
  { id: 2, name: "Lane 2", speedLimit: 20 },
  { id: 3, name: "Lane 3", speedLimit: 20 },
  { id: 4, name: "Lane 4", speedLimit: 20 },
]

export function SettingsScreen() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [speedLimits, setSpeedLimits] = useState(roads)
  const [notifications, setNotifications] = useState({
    speedViolations: true,
    congestionAlerts: true,
    cameraOffline: false,
    dailyReports: true,
  })

  // useEffect to handle mounting state and initial theme
  useEffect(() => {
    setMounted(true)
    setIsDarkMode(theme === "dark")
  }, [theme])

  // Handle speed limit change
  const handleSpeedLimitChange = (id: number, value: string) => {
    const newValue = Number.parseInt(value) || 0
    setSpeedLimits(speedLimits.map((road) => (road.id === id ? { ...road, speedLimit: newValue } : road)))
  }

  // Handle notification toggle
  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    })
  }

  // Handle save settings
  const handleSave = () => {
    // In a real app, this would save to a backend
    alert("Settings saved successfully!")
  }

  // Handle theme toggle
  const handleThemeToggle = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light"
    setTheme(newTheme)
    setIsDarkMode(checked)
  }

  // Don't render theme toggle until component is mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="px-4 py-3 space-y-4">
        <h1 className="text-xl font-bold">Settings</h1>
        <div className="h-[400px] flex items-center justify-center">
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-3 space-y-4">
      <h1 className="text-xl font-bold">Settings</h1>

      <Card className="rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base">Theme Settings</CardTitle>
          <CardDescription className="text-xs">Customize the app appearance</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className="h-5 w-5" />
              <Label htmlFor="theme-toggle">Theme Mode</Label>
              <Moon className="h-5 w-5" />
            </div>
            <Switch id="theme-toggle" checked={isDarkMode} onCheckedChange={handleThemeToggle} />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base">Speed Limits</CardTitle>
          <CardDescription className="text-xs">Configure speed limits for different Lanes</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            {speedLimits.map((road) => (
              <div key={road.id} className="grid grid-cols-2 items-center gap-4">
                <Label htmlFor={`road-${road.id}`}>{road.name}</Label>
                <div className="flex items-center">
                  <Input
                    id={`road-${road.id}`}
                    type="number"
                    value={road.speedLimit}
                    onChange={(e) => handleSpeedLimitChange(road.id, e.target.value)}
                    className="w-20"
                    min="5"
                    max="120"
                  />
                  <span className="ml-2">km/h</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base">Notifications</CardTitle>
          <CardDescription className="text-xs">Configure alert notifications</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-speed">Speed Violation Alerts</Label>
              <Switch
                id="notify-speed"
                checked={notifications.speedViolations}
                onCheckedChange={() => handleNotificationToggle("speedViolations")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-congestion">Congestion Alerts</Label>
              <Switch
                id="notify-congestion"
                checked={notifications.congestionAlerts}
                onCheckedChange={() => handleNotificationToggle("congestionAlerts")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-camera">Camera Offline Alerts</Label>
              <Switch
                id="notify-camera"
                checked={notifications.cameraOffline}
                onCheckedChange={() => handleNotificationToggle("cameraOffline")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="notify-reports">Daily Report Notifications</Label>
              <Switch
                id="notify-reports"
                checked={notifications.dailyReports}
                onCheckedChange={() => handleNotificationToggle("dailyReports")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={handleSave}>
        Save Settings
      </Button>
    </div>
  )
}
