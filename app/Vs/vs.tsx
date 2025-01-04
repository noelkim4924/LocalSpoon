import { useEffect, useState } from "react";

interface Restaurant {
  id: string;
  name: string;
  image_url: string;
}

export default function VSPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [pair, setPair] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const response = await fetch(`/api/yelp?latitude=40.7128&longitude=-74.0060&radius=10000`);
      const data = await response.json();
      setRestaurants(data.businesses);
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (restaurants.length > 1) {
      const shuffled = [...restaurants].sort(() => 0.5 - Math.random());
      setPair(shuffled.slice(0, 2));
    }
  }, [restaurants]);

  const handleWin = (winner: Restaurant) => {
    alert(`${winner.name} wins!`);
    const shuffled = [...restaurants].sort(() => 0.5 - Math.random());
    setPair(shuffled.slice(0, 2));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">VS: Choose Your Favorite</h1>
      {pair.length === 2 ? (
        <div className="flex justify-around">
          {pair.map((restaurant) => (
            <div key={restaurant.id}>
              <h2 className="text-lg font-bold">{restaurant.name}</h2>
              <img
                src={restaurant.image_url}
                alt={restaurant.name}
                className="w-48 h-32 object-cover"
                onClick={() => handleWin(restaurant)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Loading restaurants...</p>
      )}
    </div>
  );
}