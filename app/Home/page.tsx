"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Restaurant {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  // price: string | null;
  // phone: string;
  category: string;
  distance: number; // Distance from Yelp API
  imageUrl: string;
  address: string;
  url: string;
  latitude: number;
  longitude: number;
}

export default function MainPage() {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [radius, setRadius] = useState<number>(10000); // Default radius: 10km
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0); // Offset for pagination
  const [total, setTotal] = useState<number | null>(null); // Total results from Yelp

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      () => alert("Unable to fetch location. Please enter manually.")
    );
  }, []);

  const fetchRestaurants = async (loadMore = false) => {
    if (!latitude || !longitude) {
      alert("Please provide your location.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/yelp?latitude=${latitude}&longitude=${longitude}&limit=20&offset=${offset}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data.");
      }

      const data = await response.json();
      const newRestaurants = data.businesses.map((business: any) => ({
        id: business.id,
        name: business.name,
        rating: business.rating,
        reviewCount: business.review_count,
        // price: business.price || "N/A",
        // phone: business.phone,
        category: business.categories[0].title,
        distance: business.distance, // Use Yelp's distance field
        imageUrl: business.image_url,
        address: `${business.location.address1}, ${business.location.city}, ${business.location.state} ${business.location.zip_code}`,
        url: business.url,
        latitude: business.coordinates.latitude,
        longitude: business.coordinates.longitude,
      }));

      setRestaurants((prev) => (loadMore ? [...prev, ...newRestaurants] : newRestaurants));
      setTotal(data.total); // Set the total number of results from the Yelp API
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      alert("Failed to fetch restaurants. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreRestaurants = () => {
    setOffset((prevOffset) => prevOffset + 20);
  };

  useEffect(() => {
    if (offset > 0) {
      fetchRestaurants(true); // Fetch additional restaurants when offset changes
    }
  }, [offset]);

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

      {/* Radius Dropdown */}
      <select
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        className="border p-2 rounded mb-4"
      >
        <option value={1000}>1 km</option>
        <option value={5000}>5 km</option>
        <option value={10000}>10 km</option>
        <option value={20000}>20 km</option>
      </select>

      {/* Fetch Button */}
      <button
        onClick={() => fetchRestaurants()}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Find Restaurants
      </button>

      {/* Display Results */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
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
                {/* <p>Price: {restaurant.price}</p>
                <p>Phone: {restaurant.phone}</p> */}
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
        </div>
      )}
    </div>
  );
}