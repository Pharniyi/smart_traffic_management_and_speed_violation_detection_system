"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Circle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiService, dataMappers, type TrafficDensityItem } from "@/lib/api-service"
import { format } from "date-fns"

// Traffic status definitions for microcontroller integration
const trafficStatuses = {
  low: {
    id: "low",
    label: "Low Traffic (Smooth flow)",
    color: "text-green-500",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    borderColor: "border-green-500",
    description: "Traffic is moving freely with no delays",
    sensorValue: "0-30",
    microcontrollerPin: "GPIO 25",
    ledColor: "Green LED",
  },
  moderate: {
    id: "moderate",
    label: "Moderate Traffic (Busy but moving)",
    color: "text-yellow-500",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    borderColor: "border-yellow-500",
    description: "Some congestion but traffic is still flowing",
    sensorValue: "31-70",
    microcontrollerPin: "GPIO 26",
    ledColor: "Yellow LED",
  },
  high: {
    id: "high",
    label: "High Congestion (Heavy traffic)",
    color: "text-red-500",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    borderColor: "border-red-500",
    description: "Significant delays expected due to heavy traffic",
    sensorValue: "71-100",
    microcontrollerPin: "GPIO 27",
    ledColor: "Red LED",
  },
}

// Define types for combined traffic data for the graph
interface CombinedTrafficDataPoint {
  time: string // Formatted time for X-axis
  timestamp: Date // Actual Date object for sorting
  lane1Density: number
  lane2Density: number
  lane3Density: number
  lane4Density: number
}

interface LaneStatus {
  lane: string
  status: "low" | "moderate" | "high"
  density: number
}

export function HomeScreen() {
  const [trafficGraphData, setTrafficGraphData] = useState<CombinedTrafficDataPoint[]>([])
  const [laneStatuses, setLaneStatuses] = useState<LaneStatus[]>([]) // State for individual lane statuses
  const [loading, setLoading] = useState(false)

  // Fetch traffic data from external API
  const fetchTrafficDataForGraphAndStatus = async () => {
    setLoading(true)
    try {
      const apiData = await apiService.getTrafficData() // This returns TrafficDensityItem[]

      if (apiData && Array.isArray(apiData)) {
        // Group data by timestamp to create combined points for the graph
        const groupedData = new Map<string, CombinedTrafficDataPoint>()
        const latestLaneData = new Map<number, TrafficDensityItem>() // For individual lane statuses

        apiData.forEach((item) => {
          const itemDate = new Date(item.date)
          const timeKey = format(itemDate, "HH:mm") // Use HH:mm for grouping on X-axis

          // Update latest data for individual lane statuses
          const existingLatest = latestLaneData.get(item.laneId)
          if (!existingLatest || itemDate > new Date(existingLatest.date)) {
            latestLaneData.set(item.laneId, item)
          }

          // Prepare data for the graph
          if (!groupedData.has(timeKey)) {
            groupedData.set(timeKey, {
              time: timeKey,
              timestamp: itemDate, // Store actual date for sorting
              lane1Density: 0,
              lane2Density: 0,
              lane3Density: 0,
              lane4Density: 0,
            })
          }
          const currentPoint = groupedData.get(timeKey)!
          switch (item.laneId) {
            case 1:
              currentPoint.lane1Density = item.density
              break
            case 2:
              currentPoint.lane2Density = item.density
              break
            case 3:
              currentPoint.lane3Density = item.density
              break
            case 4:
              currentPoint.lane4Density = item.density
              break
          }
        })

        // Convert map to array and sort by actual timestamp
        const newGraphData = Array.from(groupedData.values()).sort(
          (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
        )

        // Limit to the last 8 data points for the graph
        setTrafficGraphData(newGraphData.slice(-8))

        // Populate individual lane statuses from the latest data points
        const currentLaneStatuses: LaneStatus[] = []
        latestLaneData.forEach((apiLaneData) => {
          const mappedData = dataMappers.mapTrafficDataForDisplay(apiLaneData)
          currentLaneStatuses.push({
            lane: mappedData.lane,
            status: mappedData.status,
            density: mappedData.density,
          })
        })
        // Sort lane statuses by lane name for consistent display
        currentLaneStatuses.sort((a, b) => a.lane.localeCompare(b.lane))
        setLaneStatuses(currentLaneStatuses)
      }
    } catch (error) {
      console.error("Error fetching traffic data:", error)
      // Fallback handled by the API service
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrafficDataForGraphAndStatus()

    // Poll for updates every 48 seconds (as per previous instruction)
    const trafficInterval = setInterval(fetchTrafficDataForGraphAndStatus, 48000)

    return () => {
      clearInterval(trafficInterval)
    }
  }, [])

  return (
    <div className="px-4 py-3 space-y-4">
      <h1 className="text-xl font-bold">Traffic Monitoring</h1>

      {/* Section for individual lane statuses */}
      <Card className="rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base">Lane Traffic Status</CardTitle>
          <CardDescription className="text-xs">Current status for each monitored lane</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          {loading ? (
            <div className="text-center text-muted-foreground p-4">Loading lane data...</div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {laneStatuses.length > 0 ? (
                laneStatuses.map((laneStatus) => {
                  const statusDef = trafficStatuses[laneStatus.status]
                  return (
                    <div
                      key={laneStatus.lane}
                      className={`p-3 rounded-lg border ${statusDef.borderColor} ${statusDef.bgColor}`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">{laneStatus.lane}</h3>
                        <Badge variant="outline" className={`text-xs ${statusDef.color}`}>
                          <Circle className={`mr-1 h-2 w-2 fill-current ${statusDef.color}`} />
                          {statusDef.label.split(" ")[0]} {/* Show only "Low", "Moderate", "High" */}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Density: {laneStatus.density}%</p>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-2 text-center text-muted-foreground p-4">No lane data available.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="graph" className="mt-4">
        <TabsList className="grid w-full grid-cols-1 h-9">
          <TabsTrigger value="graph" className="text-xs">
            Traffic Graph
          </TabsTrigger>
        </TabsList>

        <TabsContent value="graph" className="mt-3">
          <Card className="rounded-xl">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-base">Real-Time Traffic Density</CardTitle>
              <CardDescription className="text-xs">Monitoring density across all lanes</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[300px]">
                  {loading ? (
                    <div className="h-[180px] flex items-center justify-center text-muted-foreground">
                      Loading traffic data...
                    </div>
                  ) : (
                    <ChartContainer
                      config={{
                        lane1Density: {
                          label: "Lane 1 Density",
                          color: "hsl(var(--chart-1))",
                        },
                        lane2Density: {
                          label: "Lane 2 Density",
                          color: "hsl(var(--chart-2))",
                        },
                        lane3Density: {
                          label: "Lane 3 Density",
                          color: "hsl(var(--chart-3))",
                        },
                        lane4Density: {
                          label: "Lane 4 Density",
                          color: "hsl(var(--chart-4))",
                        },
                      }}
                      className="h-[180px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trafficGraphData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" tick={{ fontSize: 10 }} tickMargin={5} />
                          <YAxis tick={{ fontSize: 10 }} tickMargin={5} />
                          <Legend verticalAlign="top" height={30} iconSize={10} wrapperStyle={{ fontSize: "10px" }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Line
                            type="monotone"
                            dataKey="lane1Density"
                            stroke="var(--color-lane1Density)"
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            name="Lane 1"
                          />
                          <Line
                            type="monotone"
                            dataKey="lane2Density"
                            stroke="var(--color-lane2Density)"
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            name="Lane 2"
                          />
                          <Line
                            type="monotone"
                            dataKey="lane3Density"
                            stroke="var(--color-lane3Density)"
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            name="Lane 3"
                          />
                          <Line
                            type="monotone"
                            dataKey="lane4Density"
                            stroke="var(--color-lane4Density)"
                            strokeWidth={2}
                            activeDot={{ r: 6 }}
                            name="Lane 4"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-3">
                {Object.values(trafficStatuses).map((status) => (
                  <div
                    key={status.id}
                    className={`flex items-center justify-center p-1 rounded-lg border ${status.bgColor}`}
                  >
                    <Circle className={`mr-1 h-3 w-3 fill-current ${status.color}`} />
                    <span className="text-xs font-medium">
                      {status.id.charAt(0).toUpperCase() + status.id.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
