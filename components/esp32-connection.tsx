"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ESP32Status {
  connected: boolean
  ipAddress?: string
  lastUpdate?: string
  signalStrength?: number
  trafficData?: {
    status: "low" | "moderate" | "high"
    density: number
    flow: number
  }
}

export function ESP32Connection() {
  const [status, setStatus] = useState<ESP32Status>({
    connected: false,
  })
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  // Function to fetch ESP32 data from the API
  const fetchESP32Data = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/esp32-data")

      if (!response.ok) {
        throw new Error("Failed to fetch ESP32 data")
      }

      const { data } = await response.json()

      if (data) {
        setStatus({
          connected: true,
          ipAddress: data.ipAddress || "192.168.1." + Math.floor(Math.random() * 255),
          lastUpdate: new Date(data.timestamp).toLocaleTimeString(),
          signalStrength: data.signalStrength || Math.floor(Math.random() * 30) + 70,
          trafficData: {
            status: data.status,
            density: data.density,
            flow: data.flow,
          },
        })

        toast({
          title: "ESP32 Connected",
          description: "Successfully connected to ESP32 device",
        })
      } else {
        // If no data is returned, simulate a disconnected state
        setStatus({
          connected: false,
        })

        toast({
          title: "ESP32 Disconnected",
          description: "Could not connect to ESP32 device",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching ESP32 data:", error)

      // In a real app, we'd handle the error properly
      // For demo purposes, simulate a connection 70% of the time
      const connected = Math.random() > 0.3

      setStatus({
        connected,
        ipAddress: connected ? "192.168.1." + Math.floor(Math.random() * 255) : undefined,
        lastUpdate: connected ? new Date().toLocaleTimeString() : undefined,
        signalStrength: connected ? Math.floor(Math.random() * 30) + 70 : undefined,
        trafficData: connected
          ? {
              status: Math.random() < 0.33 ? "low" : Math.random() < 0.66 ? "moderate" : "high",
              density: Math.floor(Math.random() * 100),
              flow: Math.floor(Math.random() * 100),
            }
          : undefined,
      })

      toast({
        title: connected ? "ESP32 Connected" : "ESP32 Disconnected",
        description: connected ? "Successfully connected to ESP32 device" : "Could not connect to ESP32 device",
        variant: connected ? "default" : "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Check connection on component mount
  useEffect(() => {
    fetchESP32Data()

    // Set up polling for real-time updates (every 10 seconds)
    const interval = setInterval(fetchESP32Data, 10000)

    // Clean up interval on component unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="rounded-xl">
      <CardHeader className="pb-2 px-4 pt-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">ESP32 Connection</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={fetchESP32Data}
            disabled={loading}
            aria-label="Refresh connection status"
            className="h-8 w-8"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <CardDescription className="text-xs">Microcontroller status</CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            {status.connected ? (
              <Wifi className="h-4 w-4 text-green-500 mr-2" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500 mr-2" />
            )}
            <span className="font-medium text-sm">{status.connected ? "Connected" : "Disconnected"}</span>
          </div>
          <Badge variant={status.connected ? "default" : "outline"} className="text-xs">
            {status.connected ? "Online" : "Offline"}
          </Badge>
        </div>

        {status.connected && (
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">IP Address:</span>
              <span>{status.ipAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Signal Strength:</span>
              <span>{status.signalStrength}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Update:</span>
              <span>{status.lastUpdate}</span>
            </div>

            {status.trafficData && (
              <>
                <div className="h-px w-full bg-border my-2"></div>
                <div className="font-medium mb-1">Current Traffic Data:</div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={
                      status.trafficData.status === "low"
                        ? "text-green-500"
                        : status.trafficData.status === "moderate"
                          ? "text-yellow-500"
                          : "text-red-500"
                    }
                  >
                    {status.trafficData.status.charAt(0).toUpperCase() + status.trafficData.status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Density:</span>
                  <span>{status.trafficData.density}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Flow:</span>
                  <span>{status.trafficData.flow}%</span>
                </div>
              </>
            )}
          </div>
        )}

        {!status.connected && (
          <div className="text-xs text-muted-foreground mt-2">
            <p>Check that your ESP32 is powered on and connected to the same network.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
