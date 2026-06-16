import type { CatalogItem, Customer } from "./types"

export const REGIONS = [
  "Maharashtra",
  "Tamil Nadu",
  "Karnataka",
  "Gujarat",
  "Delhi NCR",
  "Rajasthan",
  "West Bengal",
  "Telangana",
  "Punjab",
  "Uttar Pradesh",
  "Kerala",
  "Madhya Pradesh",
  "Andhra Pradesh",
  "Haryana",
  "Odisha",
]

export const CATALOG: CatalogItem[] = [
  { code: "RES-010K", name: "Resistor 10K Ω 1%", category: "Resistors" },
  { code: "PCB-001", name: "PCB Assembly Rev3", category: "PCB / Circuit Boards" },
  { code: "PWR-24V", name: "Power Supply 24V 5A", category: "Power Supply" },
  { code: "MOT-DC12", name: "DC Motor 12V 100RPM", category: "Motors" },
  { code: "LED-RED", name: "LED Red 5mm 20mA", category: "LEDs" },
  { code: "IC-555", name: "IC Timer NE555P", category: "ICs / Semiconductors" },
  { code: "REL-12V", name: "Relay 12V SPDT 10A", category: "Relays" },
  { code: "CON-DB9", name: "DB9 Connector Male", category: "Connectors" },
  { code: "CAP-100U", name: "Capacitor 100µF 50V", category: "Capacitors" },
  { code: "TRN-NPN", name: "Transistor NPN BC547", category: "Transistors" },
  { code: "SOL-VLV", name: "Solenoid Valve 24VDC", category: "Solenoids" },
  { code: "PRS-SNS", name: "Pressure Sensor 0-10 Bar", category: "Sensors" },
]

export const CUSTOMERS: Customer[] = [
  { id: "abc", name: "ABC Electronics Ltd", region: "Maharashtra" },
  { id: "delta", name: "Delta Manufacturing Co", region: "Tamil Nadu" },
  { id: "techvision", name: "TechVision Ltd", region: "Delhi NCR" },
  { id: "prism", name: "Prism Corp", region: "Gujarat" },
  { id: "omega", name: "Omega Systems Inc", region: "Karnataka" },
]
