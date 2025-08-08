"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface ReportDataPoint {
  hour?: string
  day?: string
  week?: string
  traffic: number
  violations: number
}

export function ReportsScreen() {
  const [timeFrame, setTimeFrame] = useState("daily")
  const [reportData, setReportData] = useState<ReportDataPoint[]>([])
  const [loading, setLoading] = useState(false)

  // Asynchronous method to fetch report data
  const fetchReportData = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/reports?timeFrame=${timeFrame}`)
      if (!response.ok) {
        throw new Error("Failed to fetch report data")
      }
      const { data } = await response.json()
      setReportData(data)
    } catch (error) {
      console.error("Error fetching report data:", error)
      // Fallback to mock data on error
      if (timeFrame === "daily") {
        setReportData([
          { hour: "00:00", traffic: 10, violations: 2 },
          { hour: "03:00", traffic: 5, violations: 0 },
          { hour: "06:00", traffic: 25, violations: 3 },
          { hour: "09:00", traffic: 65, violations: 12 },
          { hour: "12:00", traffic: 45, violations: 8 },
          { hour: "15:00", traffic: 55, violations: 10 },
          { hour: "18:00", traffic: 70, violations: 15 },
          { hour: "21:00", traffic: 30, violations: 5 },
        ])
      } else if (timeFrame === "weekly") {
        setReportData([
          { day: "Mon", traffic: 45, violations: 8 },
          { day: "Tue", traffic: 50, violations: 10 },
          { day: "Wed", traffic: 55, violations: 12 },
          { day: "Thu", traffic: 60, violations: 14 },
          { day: "Fri", traffic: 70, violations: 18 },
          { day: "Sat", traffic: 40, violations: 7 },
          { day: "Sun", traffic: 30, violations: 5 },
        ])
      } else if (timeFrame === "monthly") {
        setReportData([
          { week: "Week 1", traffic: 48, violations: 42 },
          { week: "Week 2", traffic: 52, violations: 45 },
          { week: "Week 3", traffic: 58, violations: 50 },
          { week: "Week 4", traffic: 62, violations: 55 },
        ])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportData()
  }, [timeFrame]) // Re-fetch when timeFrame changes

  // Select x-axis key based on timeframe
  const xAxisKey = timeFrame === "daily" ? "hour" : timeFrame === "weekly" ? "day" : "week"

  return (
    <div className="px-4 py-3 space-y-4">
      <h1 className="text-xl font-bold">Traffic Reports</h1>

      <Tabs defaultValue="daily" onValueChange={setTimeFrame}>
        <TabsList className="grid w-full grid-cols-3 h-9">
          <TabsTrigger value="daily" className="text-xs">
            Daily
          </TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs">
            Weekly
          </TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs">
            Monthly
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-3">
          <Card className="rounded-xl">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-base">Daily Traffic Analysis</CardTitle>
              <CardDescription className="text-xs">Traffic density and violations by hour</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[300px]">
                  {loading ? (
                    <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                      Loading daily report...
                    </div>
                  ) : (
                    <TrafficChart data={reportData} xAxisKey={xAxisKey} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly" className="mt-3">
          <Card className="rounded-xl">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-base">Weekly Traffic Analysis</CardTitle>
              <CardDescription className="text-xs">Traffic density and violations by day</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[300px]">
                  {loading ? (
                    <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                      Loading weekly report...
                    </div>
                  ) : (
                    <TrafficChart data={reportData} xAxisKey={xAxisKey} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monthly" className="mt-3">
          <Card className="rounded-xl">
            <CardHeader className="pb-2 px-4 pt-4">
              <CardTitle className="text-base">Monthly Traffic Analysis</CardTitle>
              <CardDescription className="text-xs">Traffic density and violations by week</CardDescription>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <div className="w-full overflow-x-auto pb-2">
                <div className="min-w-[300px]">
                  {loading ? (
                    <div className="h-[220px] flex items-center justify-center text-muted-foreground">
                      Loading monthly report...
                    </div>
                  ) : (
                    <TrafficChart data={reportData} xAxisKey={xAxisKey} />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="rounded-xl">
        <CardHeader className="pb-2 px-4 pt-4">
          <CardTitle className="text-base">Traffic Patterns</CardTitle>
          <CardDescription className="text-xs">Analysis of congestion patterns</CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="space-y-3">
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium text-sm">Peak Hours</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Highest traffic density observed between 8:00 AM - 10:00 AM and 5:00 PM - 7:00 PM on weekdays.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium text-sm">Violation Hotspots</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Most speed violations occur on Lane 2 and Lane 4 during the day.
              </p>
            </div>
            <div className="p-3 border rounded-lg">
              <h3 className="font-medium text-sm">Trend Analysis</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Traffic has increased by 12% compared to last month, with a 8% rise in speed violations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TrafficChart({ data, xAxisKey }: { data: ReportDataPoint[]; xAxisKey: string }) {
  return (
    <ChartContainer
      config={{
        traffic: {
          label: "Traffic Density",
          color: "hsl(var(--chart-1))",
        },
        violations: {
          label: "Violations",
          color: "hsl(var(--chart-2))",
        },
      }}
      className="h-[220px]"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} tick={{ fontSize: 10 }} tickMargin={5} />
          <YAxis tick={{ fontSize: 10 }} tickMargin={5} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="traffic" fill="var(--color-traffic)" radius={4} />
          <Bar dataKey="violations" fill="var(--color-violations)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
