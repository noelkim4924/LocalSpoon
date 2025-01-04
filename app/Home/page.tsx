"use client";
import { useEffect, useState } from "react";

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  distance: number;
}

export default function MainPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(10000); // Default radius: 10km
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch user's location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => alert("Unable to fetch location. Please enter manually.")
    );
  }, []);

  const fetchRestaurants = async () => {
    if (!latitude || !longitude) {
      alert("Please provide your location.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/yelp?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data.");
      }

      const data = await response.json();
      setRestaurants(
        data.businesses.map((business: any) => ({
          id: business.id,
          name: business.name,
          rating: business.rating,
          distance: business.distance,
        }))
      );
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      alert("Failed to fetch restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Find Restaurants Near You</h1>

      {/* Radius Dropdown */}
      <select
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        className="border p-2 rounded mb-4"
      >
        <option value={10000}>10 km</option>
        <option value={20000}>20 km</option>
        <option value={30000}>30 km</option>
      </select>

      {/* Fetch Button */}
      <button
        onClick={fetchRestaurants}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Find Restaurants
      </button>

      {/* Display Results */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="mt-4">
          {restaurants.map((restaurant) => (
            <li key={restaurant.id} className="mb-4">
              <h3 className="font-bold">{restaurant.name}</h3>
              <p>Rating: {restaurant.rating}</p>
              <p>Distance: {(restaurant.distance / 1000).toFixed(1)} km</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}