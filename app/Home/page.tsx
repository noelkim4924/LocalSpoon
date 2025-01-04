"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  category: string;
  distance: number; // Calculated distance in meters
  imageUrl: string;
  address: string;
  url: string;
  latitude: number;
  longitude: number;
}

export default function MainPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(3000); // Default radius: 3km
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Haversine formula to calculate distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const toRad = (value: number) => (value * Math.PI) / 180;

    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  useEffect(() => {
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
        `/api/yelp?latitude=${latitude}&longitude=${longitude}&radius=${radius}&limit=50`
      ); // Fetch maximum allowed results in one go (50)

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data.");
      }

      const data = await response.json();
      const newRestaurants = data.businesses.map((business: any) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          business.coordinates.latitude,
          business.coordinates.longitude
        );

        return {
          id: business.id,
          name: business.name,
          rating: business.rating,
          reviewCount: business.review_count,
          category: business.categories[0].title,
          distance, // Calculated distance
          imageUrl: business.image_url,
          address: `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`,
          url: business.url,
          latitude: business.coordinates.latitude,
          longitude: business.coordinates.longitude,
        };
      })
      .filter((restaurant: any) => restaurant.distance <= radius);

      setRestaurants(newRestaurants);
      localStorage.setItem("restaurants", JSON.stringify(newRestaurants));
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

      {/* Map Visualization */}
      {latitude && longitude && (
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          style={{ height: "400px", width: "100%", marginBottom: "20px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* User Location Marker */}
          <Marker position={[latitude, longitude]}>
            <Popup>Your Location</Popup>
          </Marker>
          {/* Restaurant Markers */}
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={[restaurant.latitude, restaurant.longitude]}
            >
              <Popup>
                <strong>{restaurant.name}</strong>
                <br />
                Rating: {restaurant.rating} ({restaurant.reviewCount} reviews)
                <br />
                Distance: {(restaurant.distance / 1000).toFixed(1)} km
                <br />
                <a
                  href={restaurant.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View on Yelp
                </a>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      <Box sx={{ width: 300 }}>
        <p>Radius (in km): {radius / 1000}</p>
        <Slider
          aria-label="Temperature"
          defaultValue={3}
          valueLabelDisplay="auto"
          shiftStep={3}
          step={1}
          marks
          min={1}
          max={10}
          onChange={(e, value) => setRadius(value as number * 1000)}
        />
      </Box>

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
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <li key={restaurant.id} className="border p-4 rounded shadow-md">
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="font-bold text-lg">{restaurant.name}</h3>
              <p className="text-sm text-gray-600">{restaurant.address}</p>
              <p>Rating: {restaurant.rating} ({restaurant.reviewCount} reviews)</p>
              <p>Category: {restaurant.category}</p>
              <p>Distance: {(restaurant.distance / 1000).toFixed(1)} km</p>
              <a
                href={restaurant.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                View on Yelp
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}