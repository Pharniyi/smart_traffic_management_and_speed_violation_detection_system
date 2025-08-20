import axios from "axios"

// Base API configuration - handle different environments
const getApiBaseUrl = () => {
  // For GitHub Pages, use the full external API URL
  if (typeof window !== "undefined" && window.location.hostname.includes("github.io")) {
    return "https://traffic-control-system-production.up.railway.app"
  }

  // For Vercel or local development
  return process.env.NEXT_PUBLIC_API_BASE_URL || "https://traffic-control-system-production.up.railway.app"
}

const API_BASE_URL = getApiBaseUrl()

// New Traffic Data Types based on the provided JSON structure
export interface TrafficDensityItem {
  id: number
  laneId: number
  density: number
  date: string
  // Other properties like lane_id, traffic_status, density_percentage are not needed for mapping
}

export interface TrafficDataApiResponse {
  trafficDensitys: TrafficDensityItem[]
  status: boolean
  message: string
}

export interface ViolationResponse {
  id: string
  laneName: string
  speed: number
  speedLimit: number
  violationTimeString: string
  violationDateString: string
  imageUrl?: string
}

// API Service Functions
export const apiService = {
  // Traffic Data APIs
  async getTrafficData(): Promise<TrafficDensityItem[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/TrafficControlSystem/TrafficDensity/GetAllTrafficDensitys`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      // Extract the trafficDensitys array from the response
      const apiResponse: TrafficDataApiResponse = response.data
      return apiResponse.trafficDensitys || []
    } catch (error) {
      console.error("Error fetching traffic data:", error)
      // Return mock data as fallback
      return [
        { id: 1, laneId: 1, density: 25, date: new Date().toISOString() },
        { id: 2, laneId: 2, density: 55, date: new Date().toISOString() },
        { id: 3, laneId: 3, density: 85, date: new Date().toISOString() },
        { id: 4, laneId: 4, density: 30, date: new Date().toISOString() },
      ]
    }
  },

  // Violations API - Fetch all violations (filtering done on frontend)
  async getAllViolations(): Promise<ViolationResponse[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/TrafficControlSystem/Violation/GetAllViolations`, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("All violations response:", response.data.violations)
      return response.data.violations || []
    } catch (error) {
      console.error("Error fetching all violations:", error)
      // Return mock data as fallback
      return [
        {
          id: "v001",
          laneName: "Lane 2",
          speed: 38,
          speedLimit: 20,
          violationTimeString: "10:15 AM",
          violationDateString: "2023-03-15",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 2",
        },
        {
          id: "v002",
          laneName: "Lane 4",
          speed: 32,
          speedLimit: 20,
          violationTimeString: "10:32 AM",
          violationDateString: "2023-03-15",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 4",
        },
        {
          id: "v003",
          laneName: "Lane 1",
          speed: 25,
          speedLimit: 20,
          violationTimeString: "11:05 AM",
          violationDateString: "2023-03-15",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 1",
        },
        {
          id: "v004",
          laneName: "Lane 3",
          speed: 28,
          speedLimit: 20,
          violationTimeString: "11:47 AM",
          violationDateString: "2023-03-14",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 3",
        },
        {
          id: "v005",
          laneName: "Lane 2",
          speed: 29,
          speedLimit: 20,
          violationTimeString: "09:15 AM",
          violationDateString: "2023-03-14",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 2",
        },
        {
          id: "v006",
          laneName: "Lane 1",
          speed: 32,
          speedLimit: 20,
          violationTimeString: "08:45 AM",
          violationDateString: "2023-03-13",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 1",
        },
        {
          id: "v007",
          laneName: "Lane 4",
          speed: 25,
          speedLimit: 20,
          violationTimeString: "07:30 AM",
          violationDateString: "2023-03-13",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 4",
        },
        {
          id: "v008",
          laneName: "Lane 3",
          speed: 35,
          speedLimit: 20,
          violationTimeString: "02:20 PM",
          violationDateString: "2023-03-12",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 3",
        },
        {
          id: "v009",
          laneName: "Lane 1",
          speed: 27,
          speedLimit: 20,
          violationTimeString: "04:15 PM",
          violationDateString: "2023-03-12",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 1",
        },
        {
          id: "v010",
          laneName: "Lane 4",
          speed: 31,
          speedLimit: 20,
          violationTimeString: "06:45 PM",
          violationDateString: "2023-03-11",
          imageUrl: "/placeholder.svg?height=60&width=80&text=Lane 4",
        },
      ]
    }
  },
}

// Data mapping utilities
export const dataMappers = {
  // Map API traffic data to display format
  mapTrafficDataForDisplay: (apiData: TrafficDensityItem) => {
    let status: "low" | "moderate" | "high"
    if (apiData.density < 30) {
      status = "low"
    } else if (apiData.density < 70) {
      status = "moderate"
    } else {
      status = "high"
    }

    return {
      lane: `Lane ${apiData.laneId}`,
      status: status,
      density: apiData.density,
      timestamp: apiData.date,
      location: `Lane ${apiData.laneId}`, // Assuming location is derived from laneId
    }
  },

  // Map API violation data to display format
  mapViolationForDisplay: (apiData: ViolationResponse) => ({
    id: apiData.id,
    lane: apiData.laneName,
    speed: apiData.speed,
    speedLimit: apiData.speedLimit,
    time: apiData.violationTimeString,
    date: apiData.violationDateString,
    location: apiData.laneName, // Using laneName as location for now
    imageUrl: apiData.imageUrl || `/placeholder.svg?height=60&width=80&text=${apiData.laneName}`,
  }),
}

// Client-side filtering utilities
export const filterUtils = {
  // Filter violations by date
  filterByDate: (violations: any[], selectedDate: string) => {
    if (!selectedDate) return violations
    return violations.filter((violation) => violation.date === selectedDate)
  },

  // Filter violations by speed range
  filterBySpeedRange: (violations: any[], speedRange: string) => {
    if (!speedRange || speedRange === "all") return violations

    return violations.filter((violation) => {
      const speed = violation.speed
      switch (speedRange) {
        case "20-25":
          return speed >= 20 && speed <= 25
        case "25-30":
          return speed >= 25 && speed <= 30
        case "30+":
          return speed >= 30
        default:
          return true
      }
    })
  },

  // Filter violations by lane
  filterByLane: (violations: any[], selectedLane: string) => {
    if (!selectedLane || selectedLane === "all") return violations
    return violations.filter((violation) => violation.lane === selectedLane)
  },

  // Apply all filters
  applyAllFilters: (
    violations: any[],
    filters: {
      date?: string
      speedRange?: string
      lane?: string
    },
  ) => {
    let filteredViolations = violations

    if (filters.date) {
      filteredViolations = filterUtils.filterByDate(filteredViolations, filters.date)
    }

    if (filters.speedRange) {
      filteredViolations = filterUtils.filterBySpeedRange(filteredViolations, filters.speedRange)
    }

    if (filters.lane) {
      filteredViolations = filterUtils.filterByLane(filteredViolations, filters.lane)
    }

    return filteredViolations
  },
}

export default apiService
