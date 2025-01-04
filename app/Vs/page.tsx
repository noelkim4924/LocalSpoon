"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  distance: number;
  rating: number;
  reviewCount: number;
}

export default function VsPage() {
  const router = useRouter();

  const [tournamentList, setTournamentList] = useState<Restaurant[]>([]);
  const [currentRound, setCurrentRound] = useState<Restaurant[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [winners, setWinners] = useState<Restaurant[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);

  const [selectedWinners, setSelectedWinners] = useState<Restaurant[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("restaurantsForBracket");
    if (!data) {
      alert("No bracket data found. Please select bracket size first.");
      return;
    }
    const parsed: Restaurant[] = JSON.parse(data);

    setTournamentList(parsed);
    setCurrentRound(parsed);
  }, []);

  const pair = currentRound.slice(matchIndex * 2, matchIndex * 2 + 2);

  const handleSelectWinner = (winner: Restaurant) => {
    setWinners((prev) => [...prev, winner]);
    setSelectedWinners((prev) => [...prev, winner]);
    setMatchIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const totalMatches = currentRound.length / 2;

    if (matchIndex === totalMatches && totalMatches !== 0) {
      if (winners.length === totalMatches) {
        if (winners.length === 1) {
          const finalWinner = winners[0];
          console.log("winner:", finalWinner);
          localStorage.setItem("finalRanking", JSON.stringify(selectedWinners));
          router.push("/Ranking");
        } else {
          setCurrentRound(winners);
          setWinners([]);
          setMatchIndex(0);
          setRoundNumber((prev) => prev + 1);
        }
      }
    }
  }, [matchIndex, winners, currentRound, selectedWinners, router]);

  if (!tournamentList.length) {
    return <p>Loading bracket data...</p>;
  }

  if (pair.length === 2) {
    return (
      <div style={{ padding: "16px" }}>
        <h2>
          Round {roundNumber} -{" "}
          Match {matchIndex + 1} / {currentRound.length / 2}
        </h2>
        <div style={{ display: "flex", gap: "16px" }}>
          {pair.map((restaurant) => (
            <div
              key={restaurant.id}
              onClick={() => handleSelectWinner(restaurant)}
              style={{
                width: "200px",
                border: "1px solid #ccc",
                cursor: "pointer",
                padding: "8px",
              }}
            >
              <img
                src={restaurant.imageUrl}
                alt={restaurant.name}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <h3>{restaurant.name}</h3>
              <p>{restaurant.category}</p>
              <p>{restaurant.rating} ({restaurant.reviewCount})</p>
            </div>
          ))}
        </div>
        <p>Choose winner</p>
      </div>
    );
  } else {
    // 라운드 처리 중
    return <p>Loading...</p>;
  }
}
