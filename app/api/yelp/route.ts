import { NextResponse } from "next/server";
import axios from "axios";

const YELP_BUSINESS_SEARCH_URL = "https://api.yelp.com/v3/businesses/search";
const YELP_AI_CHAT_URL = "https://api.yelp.com/ai/chat/v1";

// Handle GET request for Yelp business search
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
    const response = await axios.get(YELP_BUSINESS_SEARCH_URL, {
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

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching Yelp business data:",
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

// Handle POST request for Yelp AI chatbot
export async function POST(request: Request) {
  try {
    const { message, chat_history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "'message' is required" },
        { status: 400 }
      );
    }

    const response = await axios.post(
      YELP_AI_CHAT_URL,
      {
        message,
        chat_history: chat_history || [], // Default to an empty array if not provided
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.YELP_API_KEY}`, // Ensure correct Bearer token usage
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching Yelp AI chat data:",
        error.response?.data || error.message
      );
      return NextResponse.json(
        {
          error:
            error.response?.data?.error?.description ||
            "Failed to fetch Yelp AI API",
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