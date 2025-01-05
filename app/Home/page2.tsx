"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { GoogleMap, Marker, Circle, useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import Slider from "@mui/material/Slider";
import BracketSelectModal from "@/components/Modal/Modal";

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
  const [radius, setRadius] = useState<number | null>(null); // Default radius: 3km
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  const [searchLocation, setSearchLocation] = useState<string>(""); // User-entered location
  const [autocomplete, setAutocomplete] = useState<any>(null); // Autocomplete instance

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"], // Ensure Places library is loaded
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error("Error fetching location:", error);
        alert("Unable to fetch your current location. Please use the search bar.");
      }
    );
  }, []);

  // Haversine formula to calculate distance
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
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

  // Fetch restaurants from Yelp API
  const fetchRestaurants = async () => {
    if (!latitude || !longitude) {
      alert("Please provide a valid location.");
      return;
    } else if (!radius) {
      alert("Please provide a valid radius.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/yelp?latitude=${latitude}&longitude=${longitude}&radius=${radius}&limit=50`
      ); // Max 50

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data.");
      }

      const data = await response.json();
      const newRestaurants = data.businesses
        .map((business: any) => {
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
            category: business.categories[0]?.title || "N/A",
            distance,
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
      console.log("Data stored in local storage:", newRestaurants);
      setConfirmModalOpen(true);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      alert("Failed to fetch restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onLoad = (autocompleteInstance: any) => {
    setAutocomplete(autocompleteInstance);
  };

  const onPlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        setLatitude(place.geometry.location.lat());
        setLongitude(place.geometry.location.lng());
        setSearchLocation(place.formatted_address || "");
        // alert(`Location updated to: ${place.formatted_address}`);
      } else {
        // alert("Location not found. Please try again.");
      }
    }
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Find Restaurants Near You</h1>

      {/* Location Search with Autocomplete */}
      <div className="mb-4">
        <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
          <input
            type="text"
            placeholder="Enter a location"
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </Autocomplete>
      </div>

      {/* Google Map */}
      {latitude && longitude && (
        <GoogleMap
          center={{ lat: latitude, lng: longitude }}
          zoom={13}
          mapContainerStyle={{ width: "100%", height: "400px" }}
        >
          <Circle
            center={{ lat: latitude, lng: longitude }}
            radius={radius}
            options={{
              strokeColor: "#008000", // Circle border color
              strokeOpacity: 0.8,
              strokeWeight: 2,
              fillColor: "#008000", // Circle fill color
              fillOpacity: 0.2,
            }}
          />

          {/* Marker for the center */}
          <Marker position={{ lat: latitude, lng: longitude }} />

          {/* Markers for restaurants */} 
          {restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
            />
          ))}
        </GoogleMap>
      )}

      {/* Distance Slider */}
      <Box sx={{ width: 300 }}>
        <p>Radius (in km): {radius / 1000}</p>
        <Slider
          aria-label="Distance"
          // defaultValue={3} // Default is 3 km
          valueLabelDisplay="auto"
          step={1}
          marks
          min={1} // Minimum radius is 1 km
          max={10} // Maximum radius is 10 km
          onChange={(e, value) => setRadius((value as number) * 1000)} // Update state
        />
      </Box>

      {/* Buttons */}
      <button
        onClick={fetchRestaurants}
        className="bg-blue-500 text-white p-2 rounded mt-2 mr-2"
      >
        Find Restaurants
      </button>

      {loading && <p>Loading...</p>}

      <BracketSelectModal isOpen={confirmModalOpen} onClose={() => setConfirmModalOpen(false)} />
    </div>
  );
}