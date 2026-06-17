import { NextResponse } from "next/server";

export async function GET() {
  // In a real application, you would fetch the latest reading from your database (e.g., Supabase)
  // For now, we mock the latest glucose reading.
  
  const mockGlucoseLevel = 105;
  let statusColor = "Good"; // Adaptive Card semantic color
  let statusText = "Normal";

  if (mockGlucoseLevel < 70) {
    statusColor = "Attention"; // Red/Warning
    statusText = "Low";
  } else if (mockGlucoseLevel > 140) {
    statusColor = "Warning"; // Yellow/Orange
    statusText = "High";
  }

  // The JSON structure returned must match the data bindings in overview-template.json
  const widgetData = {
    glucoseLevel: mockGlucoseLevel,
    statusColor: statusColor,
    statusText: statusText
  };

  return NextResponse.json(widgetData);
}
