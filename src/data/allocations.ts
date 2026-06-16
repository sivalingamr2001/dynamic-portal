import type { AllocationItem, FulfillmentLine, RecentEntry } from "./types"

export const ALLOCATION_ITEMS: AllocationItem[] = [
  { id: "a1", itemCode: "RES-010K", itemName: "Resistor 10K Ω 1%", customer: "ABC Electronics Ltd", region: "Maharashtra", binQty: 10000, approvedQty: 10000, targetDate: "2024-12-10", status: "APPROVED" },
  { id: "a2", itemCode: "PCB-001", itemName: "PCB Assembly Rev3", customer: "ABC Electronics Ltd", region: "Maharashtra", binQty: 500, approvedQty: 480, targetDate: "2024-12-15", status: "APPROVED" },
  { id: "a3", itemCode: "PWR-24V", itemName: "Power Supply 24V 5A", customer: "Delta Manufacturing Co", region: "Tamil Nadu", binQty: 50, approvedQty: 45, targetDate: "2024-12-18", status: "APPROVED" },
  { id: "a4", itemCode: "MOT-DC12", itemName: "DC Motor 12V 100RPM", customer: "Delta Manufacturing Co", region: "Tamil Nadu", binQty: 200, approvedQty: 200, targetDate: "2024-12-20", status: "APPROVED" },
  { id: "a5", itemCode: "LED-RED", itemName: "LED Red 5mm 20mA", customer: "Open Pool", region: "—", binQty: 20000, approvedQty: 18000, targetDate: "2024-12-22", status: "APPROVED" },
  { id: "a6", itemCode: "IC-555", itemName: "IC Timer NE555P", customer: "Open Pool", region: "—", binQty: 5000, approvedQty: 5000, targetDate: "2024-12-25", status: "APPROVED" },
  { id: "a7", itemCode: "REL-12V", itemName: "Relay 12V SPDT 10A", customer: "Omega Systems Inc", region: "Karnataka", binQty: 300, approvedQty: 300, targetDate: "2024-12-28", status: "PENDING" },
  { id: "a8", itemCode: "CON-DB9", itemName: "DB9 Connector Male", customer: "Omega Systems Inc", region: "Karnataka", binQty: 1000, approvedQty: 1000, targetDate: "2024-12-30", status: "PENDING" },
  { id: "a9", itemCode: "LED-RED", itemName: "LED Red 5mm 20mA", customer: "Open Pool", region: "—", binQty: 5000, approvedQty: 5000, targetDate: "2024-12-31", status: "APPROVED" },
  { id: "a10", itemCode: "TRN-NPN", itemName: "Transistor NPN BC547", customer: "Prism Corp", region: "Gujarat", binQty: 8000, approvedQty: 8000, targetDate: "2025-01-05", status: "PENDING" },
  { id: "a11", itemCode: "CAP-100U", itemName: "Capacitor 100µF 50V", customer: "Prism Corp", region: "Gujarat", binQty: 3000, approvedQty: 3000, targetDate: "2025-01-10", status: "PENDING" },
  { id: "a12", itemCode: "PCB-001", itemName: "PCB Assembly Rev3", customer: "Open Pool", region: "—", binQty: 200, approvedQty: 200, targetDate: "2025-01-15", status: "PENDING" },
  { id: "a13", itemCode: "SOL-VLV", itemName: "Solenoid Valve 24VDC", customer: "TechVision Ltd", region: "Delhi NCR", binQty: 120, approvedQty: 120, targetDate: "2025-01-18", status: "PENDING" },
  { id: "a14", itemCode: "PWR-24V", itemName: "Power Supply 24V 5A", customer: "TechVision Ltd", region: "Delhi NCR", binQty: 75, approvedQty: 75, targetDate: "2025-01-20", status: "PENDING" },
  { id: "a15", itemCode: "PRS-SNS", itemName: "Pressure Sensor 0-10 Bar", customer: "ABC Electronics Ltd", region: "Maharashtra", binQty: 6060, approvedQty: 6060, targetDate: "2025-01-25", status: "AMENDMENT_PENDING" },
]

export const FULFILLMENT_LINES: FulfillmentLine[] = [
  { id: "f1", itemCode: "PCB-001", itemName: "PCB Assembly Rev3", customer: "ABC Electronics Ltd", region: "Maharashtra", approvedQty: 480, allocated: 450, daysToOd: 547, status: "Partial" },
  { id: "f2", itemCode: "RES-010K", itemName: "Resistor 10K Ω 1%", customer: "ABC Electronics Ltd", region: "Maharashtra", approvedQty: 10000, allocated: 10000, daysToOd: 552, status: "Fulfilled" },
  { id: "f3", itemCode: "MOT-DC12", itemName: "DC Motor 12V 100RPM", customer: "Delta Manufacturing Co", region: "Tamil Nadu", approvedQty: 200, allocated: 200, daysToOd: 542, status: "Fulfilled" },
  { id: "f4", itemCode: "PWR-24V", itemName: "Power Supply 24V 5A", customer: "Delta Manufacturing Co", region: "Tamil Nadu", approvedQty: 45, allocated: 45, daysToOd: 544, status: "Fulfilled" },
  { id: "f5", itemCode: "IC-555", itemName: "IC Timer NE555P", customer: "Open Pool", region: "—", approvedQty: 5000, allocated: 5000, daysToOd: 537, status: "Fulfilled" },
  { id: "f6", itemCode: "LED-RED", itemName: "LED Red 5mm 20mA", customer: "Open Pool", region: "—", approvedQty: 18000, allocated: 18000, daysToOd: 540, status: "Fulfilled" },
  { id: "f7", itemCode: "LED-RED", itemName: "LED Red 5mm 20mA", customer: "Open Pool", region: "—", approvedQty: 5000, allocated: 18000, daysToOd: 531, status: "Fulfilled" },
]

export const RECENT_ENTRIES: RecentEntry[] = [
  { id: "r1", itemCode: "PRS-SNS", status: "AMEND", customer: "ABC Electronics Ltd", quantity: 60, targetDate: "2025-01-25" },
  { id: "r2", itemCode: "SOL-VLV", status: "PENDING", customer: "TechVision Ltd", quantity: 120, targetDate: "2025-01-18" },
  { id: "r3", itemCode: "PWR-24V", status: "PENDING", customer: "TechVision Ltd", quantity: 75, targetDate: "2025-01-20" },
  { id: "r4", itemCode: "LED-RED", status: "APPROVED", customer: "Open Pool", quantity: 5000, targetDate: "2024-12-31" },
  { id: "r5", itemCode: "PCB-001", status: "PENDING", customer: "Open Pool", quantity: 200, targetDate: "2025-01-15" },
  { id: "r6", itemCode: "CAP-100U", status: "PENDING", customer: "Prism Corp", quantity: 3000, targetDate: "2025-01-10" },
  { id: "r7", itemCode: "TRN-NPN", status: "PENDING", customer: "Prism Corp", quantity: 8000, targetDate: "2025-01-05" },
  { id: "r8", itemCode: "REL-12V", status: "PENDING", customer: "Omega Systems Inc", quantity: 300, targetDate: "2024-12-28" },
]

export const NAV_BADGES = { approval: 7, amendment: 1 }
