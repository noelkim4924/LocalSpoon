"use client";

import { useEffect, useState } from "react";

interface Restaurant {
  rid: number;
  name: string;
  category: string;
  imageUrl: string;
  distance: number;
}

export default function RandomRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [currentPair, setCurrentPair] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch data from local storage on component mount
    const storedData = localStorage.getItem("restaurants");
    if (storedData) {
      const parsedData: Restaurant[] = JSON.parse(storedData);
      setRestaurants(parsedData);
      getNextPair(parsedData); // Load the first pair
    } else {
      alert("No restaurant data found in local storage.");
    }
    setLoading(false);
  }, []);

  const getNextPair = (data: Restaurant[] = restaurants) => {
    if (data.length < 2) {
      alert("Not enough restaurants to proceed.");
      return;
    }

    // Randomly select two unique restaurants
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setCurrentPair(shuffled.slice(0, 2));
  };

  const handleSelection = (selected: Restaurant) => {
    console.log(`Selected restaurant: ${selected.name}`);
    // Proceed to the next round with a new random pair
    getNextPair();
  };

  if (loading) return <p>Loading...</p>;

  if (!currentPair.length)
    return <p>No restaurant data available for display. Ensure local storage is populated.</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Choose Your Favorite Restaurant</h1>
      <div className="grid grid-cols-2 gap-4">
        {currentPair.map((restaurant) => (
          <div
            key={restaurant.rid}
            className="border p-4 rounded shadow-md cursor-pointer hover:shadow-lg"
            onClick={() => handleSelection(restaurant)}
          >
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h3 className="font-bold text-lg">{restaurant.name}</h3>
            <p className="text-sm text-gray-600">{restaurant.category}</p>
            <p>Distance: {(restaurant.distance / 1000).toFixed(1)} km</p>
          </div>
        ))}
      </div>
    </div>
  );
}