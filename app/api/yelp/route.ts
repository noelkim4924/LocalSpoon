import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

const YELP_API_URL = "https://api.yelp.com/v3/businesses/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const term = searchParams.get("term") || "restaurants";

  if (!latitude || !longitude) {
    return NextResponse.json(
      { error: "Latitude and longitude are required" },
      { status: 400 }
    );
  }

  
  try {
    const response = await axios.get(YELP_API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
      },
      params: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        term,
        limit: 50,
      },
    });

    // Return Yelp API response
    return NextResponse.json(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching Yelp data:",
        error.response?.data || error.message
      );

      return NextResponse.json(
        {
          error:
            error.response?.data?.error?.description ||
            "Failed to fetch Yelp API",
        },
        { status: error.response?.status || 500 }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}