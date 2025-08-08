"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { apiService, dataMappers, filterUtils } from "@/lib/api-service"

interface Violation {
  id: string
  lane: string
  speed: number
  speedLimit: number
  time: string
  date: string
  location: string
  imageUrl: string
}

export function ViolationLogScreen() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [speedRange, setSpeedRange] = useState<string>("all")
  const [selectedLane, setSelectedLane] = useState<string>("all")
  const [allViolations, setAllViolations] = useState<Violation[]>([])
  const [filteredViolations, setFilteredViolations] = useState<Violation[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch all violations from external API
  const fetchAllViolations = async () => {
    setLoading(true)
    try {
      const apiViolations = await apiService.getAllViolations()

      // Map API data to display format
      const mappedViolations = apiViolations.map((apiViolation) => dataMappers.mapViolationForDisplay(apiViolation))

      setAllViolations(mappedViolations)
      setFilteredViolations(mappedViolations) // Initially show all violations
    } catch (error) {
      console.error("Error fetching violations:", error)
      // Fallback handled by the API service
    } finally {
      setLoading(false)
    }
  }

  // Apply client-side filters
  const applyFilters = () => {
    const filters: any = {}

    if (date) {
      filters.date = format(date, "yyyy-MM-dd")
    }

    if (speedRange !== "all") {
      filters.speedRange = speedRange
    }

    if (selectedLane !== "all") {
      filters.lane = selectedLane
    }

    const filtered = filterUtils.applyAllFilters(allViolations, filters)
    setFilteredViolations(filtered)
  }

  // Apply filters whenever filter values change
  useEffect(() => {
    applyFilters()
  }, [date, speedRange, selectedLane, allViolations])

  // Fetch violations on component mount
  useEffect(() => {
    fetchAllViolations()
  }, [])

  // Get unique lanes for filter dropdown
  const uniqueLanes = Array.from(new Set(allViolations.map((v) => v.lane))).sort()

  return (
    <div className="container p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Violation Log</h1>
        <Button variant="outline" size="sm" onClick={fetchAllViolations} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Violations</CardTitle>
          <CardDescription>Filter by date, speed range, or lane</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
              {date && (
                <Button variant="ghost" className="w-full" onClick={() => setDate(undefined)}>
                  Clear Date
                </Button>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lane">Lane</Label>
              <Select value={selectedLane} onValueChange={setSelectedLane}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lane" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lanes</SelectItem>
                  {uniqueLanes.map((lane) => (
                    <SelectItem key={lane} value={lane}>
                      {lane}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="speed">Speed Range (km/h)</Label>
              <Select value={speedRange} onValueChange={setSpeedRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select speed range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Speeds</SelectItem>
                  <SelectItem value="20-25">20-25 km/h</SelectItem>
                  <SelectItem value="25-30">25-30 km/h</SelectItem>
                  <SelectItem value="30+">30+ km/h</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Violation Records</CardTitle>
          <CardDescription>
            {loading ? "Loading..." : `Showing ${filteredViolations.length} of ${allViolations.length} violations`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {loading ? (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">Loading violations...</p>
                </div>
              ) : filteredViolations.length > 0 ? (
                filteredViolations.map((violation) => (
                  <div key={violation.id} className="p-4 border rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-shrink-0">
                        <img
                          src={violation.imageUrl || null}
                          alt={`Image from ${violation.lane}`}
                          className="rounded-sm object-cover w-full sm:w-20 h-15"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start w-full">
                          <h3 className="font-medium text-base">{violation.lane}</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">Location:</span> {violation.location}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Date:</span> {violation.date}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Time:</span> {violation.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No violations found with the selected filters.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
