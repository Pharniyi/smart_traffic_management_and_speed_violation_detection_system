// This is a helper file with information about microcontroller integration
// In a real implementation, this would contain actual code to communicate with the hardware

export interface PinMapping {
  pin: string
  function: string
  description: string
}

export const arduinoMapping: PinMapping[] = [
  { pin: "A0", function: "Traffic Density Sensor", description: "Analog input for traffic density sensor (0-1023)" },
  { pin: "A1", function: "Traffic Flow Sensor", description: "Analog input for traffic flow sensor (0-1023)" },
  { pin: "D2", function: "Low Traffic LED", description: "Digital output for green LED (LOW/HIGH)" },
  { pin: "D3", function: "Moderate Traffic LED", description: "Digital output for yellow LED (LOW/HIGH)" },
  { pin: "D4", function: "High Traffic LED", description: "Digital output for red LED (LOW/HIGH)" },
  { pin: "D5", function: "Alert Buzzer", description: "Digital output for buzzer on severe congestion (LOW/HIGH)" },
]

export const raspberryPiMapping: PinMapping[] = [
  { pin: "GPIO 17", function: "Traffic Density Sensor", description: "Input for traffic density sensor" },
  { pin: "GPIO 27", function: "Traffic Flow Sensor", description: "Input for traffic flow sensor" },
  { pin: "GPIO 22", function: "Low Traffic LED", description: "Output for green LED" },
  { pin: "GPIO 23", function: "Moderate Traffic LED", description: "Output for yellow LED" },
  { pin: "GPIO 24", function: "High Traffic LED", description: "Output for red LED" },
  { pin: "GPIO 25", function: "Alert Buzzer", description: "Output for buzzer on severe congestion" },
]

// Add ESP32 pin mapping after the raspberryPiMapping array

export const esp32Mapping: PinMapping[] = [
  {
    pin: "GPIO 36 (ADC1_CH0)",
    function: "Traffic Density Sensor",
    description: "Analog input for traffic density sensor",
  },
  { pin: "GPIO 39 (ADC1_CH3)", function: "Traffic Flow Sensor", description: "Analog input for traffic flow sensor" },
  { pin: "GPIO 25", function: "Low Traffic LED", description: "Digital output for green LED" },
  { pin: "GPIO 26", function: "Moderate Traffic LED", description: "Digital output for yellow LED" },
  { pin: "GPIO 27", function: "High Traffic LED", description: "Digital output for red LED" },
  { pin: "GPIO 14", function: "Alert Buzzer", description: "Digital output for buzzer on severe congestion" },
]

// Example Arduino code for reference
export const arduinoSampleCode = `
// Traffic Monitoring System - Arduino Integration
// Connect to the mobile app via Bluetooth or WiFi

#include <SoftwareSerial.h>

// Pin definitions
const int DENSITY_SENSOR = A0;
const int FLOW_SENSOR = A1;
const int LOW_TRAFFIC_LED = 2;
const int MODERATE_TRAFFIC_LED = 3;
const int HIGH_TRAFFIC_LED = 4;
const int ALERT_BUZZER = 5;

// Thresholds for traffic status
const int LOW_THRESHOLD = 30;
const int HIGH_THRESHOLD = 70;

// Variables
int trafficDensity = 0;
int trafficFlow = 0;
String trafficStatus = "low";

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Set pin modes
  pinMode(LOW_TRAFFIC_LED, OUTPUT);
  pinMode(MODERATE_TRAFFIC_LED, OUTPUT);
  pinMode(HIGH_TRAFFIC_LED, OUTPUT);
  pinMode(ALERT_BUZZER, OUTPUT);
  
  // Initial state - all LEDs off
  digitalWrite(LOW_TRAFFIC_LED, LOW);
  digitalWrite(MODERATE_TRAFFIC_LED, LOW);
  digitalWrite(HIGH_TRAFFIC_LED, LOW);
  digitalWrite(ALERT_BUZZER, LOW);
}

void loop() {
  // Read sensor values
  trafficDensity = analogRead(DENSITY_SENSOR);
  trafficFlow = analogRead(FLOW_SENSOR);
  
  // Map to 0-100 scale
  trafficDensity = map(trafficDensity, 0, 1023, 0, 100);
  trafficFlow = map(trafficFlow, 0, 1023, 0, 100);
  
  // Determine traffic status
  if (trafficDensity < LOW_THRESHOLD) {
    trafficStatus = "low";
    setLEDs(HIGH, LOW, LOW);
  } else if (trafficDensity < HIGH_THRESHOLD) {
    trafficStatus = "moderate";
    setLEDs(LOW, HIGH, LOW);
  } else {
    trafficStatus = "high";
    setLEDs(LOW, LOW, HIGH);
    
    // Activate buzzer for high congestion
    if (trafficDensity > 90) {
      digitalWrite(ALERT_BUZZER, HIGH);
    } else {
      digitalWrite(ALERT_BUZZER, LOW);
    }
  }
  
  // Send data to serial (for app communication)
  Serial.print("STATUS:");
  Serial.print(trafficStatus);
  Serial.print(",DENSITY:");
  Serial.print(trafficDensity);
  Serial.print(",FLOW:");
  Serial.println(trafficFlow);
  
  delay(1000); // Update every second
}

void setLEDs(int low, int moderate, int high) {
  digitalWrite(LOW_TRAFFIC_LED, low);
  digitalWrite(MODERATE_TRAFFIC_LED, moderate);
  digitalWrite(HIGH_TRAFFIC_LED, high);
}
`

// Add ESP32 sample code after the arduinoSampleCode

export const esp32SampleCode = `
// Traffic Monitoring System - ESP32 Integration
// Uses WiFi to connect to the mobile app server

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// WiFi credentials
const char* ssid = "YourWiFiSSID";
const char* password = "YourWiFiPassword";

// Server details
const char* serverUrl = "http://your-server-address/api/traffic-data";

// Pin definitions
const int DENSITY_SENSOR = 36;  // ADC1_CH0
const int FLOW_SENSOR = 39;     // ADC1_CH3
const int LOW_TRAFFIC_LED = 25;
const int MODERATE_TRAFFIC_LED = 26;
const int HIGH_TRAFFIC_LED = 27;
const int ALERT_BUZZER = 14;

// Thresholds for traffic status
const int LOW_THRESHOLD = 30;
const int HIGH_THRESHOLD = 70;

// Variables
int trafficDensity = 0;
int trafficFlow = 0;
String trafficStatus = "low";

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  
  // Set pin modes
  pinMode(LOW_TRAFFIC_LED, OUTPUT);
  pinMode(MODERATE_TRAFFIC_LED, OUTPUT);
  pinMode(HIGH_TRAFFIC_LED, OUTPUT);
  pinMode(ALERT_BUZZER, OUTPUT);
  
  // Initial state - all LEDs off
  digitalWrite(LOW_TRAFFIC_LED, LOW);
  digitalWrite(MODERATE_TRAFFIC_LED, LOW);
  digitalWrite(HIGH_TRAFFIC_LED, LOW);
  digitalWrite(ALERT_BUZZER, LOW);
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // Read sensor values
  trafficDensity = analogRead(DENSITY_SENSOR);
  trafficFlow = analogRead(FLOW_SENSOR);
  
  // ESP32 ADC has 12-bit resolution (0-4095), map to 0-100 scale
  trafficDensity = map(trafficDensity, 0, 4095, 0, 100);
  trafficFlow = map(trafficFlow, 0, 4095, 0, 100);
  
  // Determine traffic status
  if (trafficDensity < LOW_THRESHOLD) {
    trafficStatus = "low";
    setLEDs(HIGH, LOW, LOW);
  } else if (trafficDensity < HIGH_THRESHOLD) {
    trafficStatus = "moderate";
    setLEDs(LOW, HIGH, LOW);
  } else {
    trafficStatus = "high";
    setLEDs(LOW, LOW, HIGH);
    
    // Activate buzzer for high congestion
    if (trafficDensity > 90) {
      digitalWrite(ALERT_BUZZER, HIGH);
    } else {
      digitalWrite(ALERT_BUZZER, LOW);
    }
  }
  
  // Send data to serial for debugging
  Serial.print("STATUS: ");
  Serial.print(trafficStatus);
  Serial.print(", DENSITY: ");
  Serial.print(trafficDensity);
  Serial.print(", FLOW: ");
  Serial.println(trafficFlow);
  
  // Send data to server if WiFi is connected
  if (WiFi.status() == WL_CONNECTED) {
    sendDataToServer(trafficStatus, trafficDensity, trafficFlow);
  }
  
  delay(2000); // Update every 2 seconds
}

void setLEDs(int low, int moderate, int high) {
  digitalWrite(LOW_TRAFFIC_LED, low);
  digitalWrite(MODERATE_TRAFFIC_LED, moderate);
  digitalWrite(HIGH_TRAFFIC_LED, high);
}

void sendDataToServer(String status, int density, int flow) {
  HTTPClient http;
  
  // Create JSON document
  StaticJsonDocument<200> doc;
  doc["status"] = status;
  doc["density"] = density;
  doc["flow"] = flow;
  doc["timestamp"] = millis();
  
  // Serialize JSON to string
  String jsonString;
  serializeJson(doc, jsonString);
  
  // Begin HTTP connection
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");
  
  // Send POST request
  int httpResponseCode = http.POST(jsonString);
  
  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.println("HTTP Response code: " + String(httpResponseCode));
    Serial.println(response);
  } else {
    Serial.println("Error on sending POST: " + String(httpResponseCode));
  }
  
  // Free resources
  http.end();
}
`

// Function to determine traffic status based on sensor values
export function determineTrafficStatus(density: number, flow: number): "low" | "moderate" | "high" {
  if (density < 30) return "low"
  if (density < 70) return "moderate"
  return "high"
}

// Function to format sensor data for display
export function formatSensorData(density: number, flow: number) {
  return {
    density,
    flow,
    status: determineTrafficStatus(density, flow),
    timestamp: new Date().toISOString(),
  }
}
