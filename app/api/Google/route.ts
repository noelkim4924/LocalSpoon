import { NextResponse } from "next/server";

const GOOGLE_GEOCODING_API = "https://maps.googleapis.com/maps/api/geocode/json";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  if (!location) {
    return NextResponse.json({ error: "Location is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${GOOGLE_GEOCODING_API}?address=${encodeURIComponent(location)}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.status !== "OK") {
      return NextResponse.json({ error: "Failed to fetch geocoding data" }, { status: 400 });
    }

    return NextResponse.json(data.results[0].geometry.location);
  } catch (error) {
    console.error("Error in Google API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}