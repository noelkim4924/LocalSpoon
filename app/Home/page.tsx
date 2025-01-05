"use client";
import { useEffect, useState, useRef } from "react";
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
  distance: number;
  imageUrl: string;
  address: string;
  url: string;
  latitude: number;
  longitude: number;
}

export default function MainPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number | null>(5 * 1000); // Default radius: 5km
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);

  const [searchLocation, setSearchLocation] = useState<string>(""); // User-entered location
  const [autocomplete, setAutocomplete] = useState<any>(null); // Autocomplete instance

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"], // Ensure Places library is loaded
  });

  const sliderRef = useRef<HTMLDivElement>(null);
  const [autoSlide, setAutoSlide] = useState(true);

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

  // 자동 슬라이드 효과
  useEffect(() => {
    if (!autoSlide) return;

    const interval = setInterval(() => {
      if (sliderRef.current) {
        sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
        if (
          sliderRef.current.scrollLeft + sliderRef.current.offsetWidth >=
          sliderRef.current.scrollWidth
        ) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoSlide]);

  const fetchRestaurants = async () => {
    if (!latitude || !longitude || !radius) {
      alert("Please provide valid location and radius.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/yelp?latitude=${latitude}&longitude=${longitude}&radius=${radius}&limit=50`
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
          reviewCount: business.review_count,
          category: business.categories[0]?.title || "N/A",
          distance: business.distance,
          imageUrl: business.image_url,
          address: `${business.location.address1}, ${business.location.city}`,
          url: business.url,
          latitude: business.coordinates.latitude,
          longitude: business.coordinates.longitude,
        }))
      );
      setConfirmModalOpen(true);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      alert("Failed to fetch restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
      setAutoSlide(false);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
      setAutoSlide(false);
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
      }
    }
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="flex w-[80%] max-w-6xl gap-8">
        {/* Left Panel */}
        <div className="flex-1 bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold mb-4">Find Restaurants Near You</h1>
          <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
            <input
              type="text"
              placeholder="Enter a location"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="border p-2 rounded w-full mb-4"
            />
          </Autocomplete>
          <Box sx={{ width: "100%" }} className="mb-4">
            <p>Radius (in km): {radius ? radius / 1000 : "Not set"}</p>
            <Slider
              value={radius ? radius / 1000 : 5}
              min={1}
              max={10}
              step={1}
              valueLabelDisplay="auto"
              onChange={(e, value) => setRadius((value as number) * 1000)}
            />
          </Box>
          <button
            onClick={fetchRestaurants}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Find Restaurants
          </button>
        </div>

        {/* Map Panel */}
        <div className="flex-1 h-[500px] bg-white rounded shadow overflow-hidden">
          {latitude && longitude && (
            <GoogleMap
              center={{ lat: latitude, lng: longitude }}
              zoom={13}
              mapContainerStyle={{ width: "100%", height: "100%" }}
            >
              <Circle
                center={{ lat: latitude, lng: longitude }}
                radius={radius}
                options={{
                  strokeColor: "#008000",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: "#008000",
                  fillOpacity: 0.2,
                }}
              />
              <Marker position={{ lat: latitude, lng: longitude }} />
              {restaurants.map((restaurant) => (
                <Marker
                  key={restaurant.id}
                  position={{
                    lat: restaurant.latitude,
                    lng: restaurant.longitude,
                  }}
                />
              ))}
            </GoogleMap>
          )}
        </div>
      </div>

      {/* Bottom Slider */}
      <div className="w-[80%] max-w-6xl mt-8 relative">
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-300 focus:outline-none text-2xl"
          onClick={scrollLeft}
        >
          &lt;
        </button>
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-4 custom-scrollbar"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[300px] h-[200px] bg-gray-300 rounded shadow"
              style={{ scrollSnapAlign: "start" }}
            />
          ))}
        </div>
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 text-gray-800 rounded-full p-2 shadow-lg hover:bg-gray-300 focus:outline-none text-2xl"
          onClick={scrollRight}
        >
          &gt;
        </button>
      </div>

      <BracketSelectModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      />
    </div>
  );
}
