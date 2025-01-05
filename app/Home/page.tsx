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
  const [radius, setRadius] = useState<number>(5000); // Default radius: 5km
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [autoSlide, setAutoSlide] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0); // 현재 슬라이드 인덱스
  const [autocomplete, setAutocomplete] = useState<any>(null);

  const sliderRef = useRef<HTMLDivElement>(null);
  const slideCount = 3; // 슬라이드 카드 개수

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
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

  useEffect(() => {
    if (!autoSlide) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount); // 다음 슬라이드로 이동
    }, 3000);

    return () => clearInterval(interval);
  }, [autoSlide]);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.offsetWidth * currentSlide,
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  const scrollLeft = () => {
    setAutoSlide(false); // 수동으로 조작 시 자동 슬라이드 중지
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const scrollRight = () => {
    setAutoSlide(false); // 수동으로 조작 시 자동 슬라이드 중지
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const goToSlide = (index: number) => {
    setAutoSlide(false); // 수동으로 조작 시 자동 슬라이드 중지
    setCurrentSlide(index);
  };

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

    return R * c;
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
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data.");
      }

      const data = await response.json();
      const newRestaurants = data.businesses
        .map((business: any) => {
          const distance = calculateDistance(
            latitude!,
            longitude!,
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
      }
    }
  };

  if (!isLoaded) return <p>Loading Google Maps...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="flex flex-col items-center justify-center w-full max-w-6xl mx-auto mt-16">
        <div className="flex w-full gap-12">
          <div className="flex-[4] p-8">
            <h1 className="text-4xl font-extrabold mt-10 mb-6 leading-tight">
              Support Local, <br /> Savour the Flavour
            </h1>
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                placeholder="Search"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="border p-3 rounded w-full mb-6 text-lg"
              />
            </Autocomplete>
            <Box sx={{ width: "100%" }} className="mb-6">
              <p className="text-lg">Radius in {radius ? `${radius / 1000} km` : "5 km"}</p>
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
              className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-medium"
            >
              Done
            </button>
          </div>

          <div
            className="flex-[6] bg-white rounded shadow overflow-hidden"
            style={{ aspectRatio: "1 / 1" }}
          >
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
                    position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
                  />
                ))}
              </GoogleMap>
            )}
          </div>
        </div>

       {/* 배너 슬라이드 */}
       <div className="w-full mt-12 relative">
  {/* 화살표 제거 */}
  <div
    ref={sliderRef}
    className="flex gap-4"
    style={{ width: "100%", overflow: "hidden" }}
  >
    {[1, 2, 3].map((_, index) => (
      <div
        key={index}
        className={`flex-shrink-0 w-full h-[200px] bg-gray-300 rounded shadow transition-transform duration-300 ${
          currentSlide === index ? "opacity-100" : "opacity-50"
        }`}
      />
    ))}
  </div>
          {/* 슬라이드 인디케이터 */}
          <div className="flex justify-center mt-4">
            {[...Array(slideCount)].map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full mx-1 ${
                  currentSlide === index ? "bg-gray-800" : "bg-gray-400"
                }`}
              ></button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center mt-4">
          <p className="text-blue-500 font-bold">Loading restaurants...</p>
        </div>
      )}

      <BracketSelectModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
      />
    </div>
  );
}
