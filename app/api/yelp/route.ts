import { NextResponse } from "next/server";
import axios, { AxiosError } from "axios";

const YELP_API_URL = "https://api.yelp.com/v3/businesses/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const latitude = searchParams.get("latitude");
  const longitude = searchParams.get("longitude");
  const radius = searchParams.get("radius");
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
        latitude,
        longitude,
        radius,
        term,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    // Use AxiosError for strong typing
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      console.error(
        "Error fetching Yelp data:",
        axiosError.response?.data || axiosError.message
      );

      return NextResponse.json(
        {
          error:
            axiosError.response?.data?.error?.description ||
            "Failed to fetch Yelp API",
        },
        { status: axiosError.response?.status || 500 }
      );
    }

    // Handle non-Axios errors
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}