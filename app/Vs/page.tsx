"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import styles from "./page.module.css";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";

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
  const [currentRoundNumber, setCurrentRoundNumber] = useState(1);
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
    setCurrentRoundNumber((prev) => prev + 1);
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

          router.push("/Loading2");
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
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#FFF3DE] p-4">
        <div className="w-[750px] flex justify-end">
          <img
            src="/images/flag.png"
            alt="Flag Icon"
            className="w-[50px] h-[50px]"
          />
        </div>

        <div className="relative w-[970px] h-[60px] bg-[#ddd] rounded-[20px] overflow-visible mb-[40px]">
          <div
            className="absolute top-0 left-0 h-full bg-[#FA9D39] transition-all duration-300"
            style={{
              width: `${(currentRoundNumber * 100) / tournamentList.length - 1}%`,
            }}
          />
          <img
            src={`/images/round${roundNumber}.png`}
            alt="Middle Icon"
            className="absolute w-[150px] h-[150px] 
                       top-1/4 left-1/2 
                       transform -translate-x-1/2 -translate-y-1/2 
                       z-[9999]"
          />
        </div>

        <div className="flex">
          <div
            key={pair[0].id}
            onClick={() => handleSelectWinner(pair[0])}
            className={`${styles.background_trapezoid} hover:scale-105 transition-transform duration-300 w-[540px] border border-gray-300 cursor-pointer p-2`}
          >
            <img
              src={pair[0].imageUrl}
              alt={pair[0].name}
              style={{ width: "100%", height: "550px", objectFit: "cover" }}
              className={styles.trapezoid}
            />
            <div className="ml-3 mt-5 mb-5">
              <h3 className="text-[26px]">{pair[0].name}</h3>
              <div className="flex items-center">
                {pair[0].rating}
                <Stack spacing={1} className="ml-1">
                  <Rating
                    name="half-rating-read"
                    defaultValue={pair[0].rating}
                    precision={0.1}
                    readOnly
                  />
                </Stack>
                <span className="ml-1">({pair[0].reviewCount})</span>
              </div>
              <p className="italic">{pair[0].category} restaurant</p>
            </div>
          </div>

          <div
            key={pair[1].id}
            onClick={() => handleSelectWinner(pair[1])}
            className={`${styles.background_reverse_trapezoid} hover:scale-105 transition-transform duration-300 w-[540px] border border-gray-300 cursor-pointer p-2 ml-[-110px]`}
          >
            <div className="text-right mr-3 mt-5 mb-5">
              <h3 className="text-[26px]">{pair[1].name}</h3>
              <div className="flex items-center justify-end w-full">
                <span>{pair[1].rating}</span>
                <Stack spacing={1} className="ml-1">
                  <Rating
                    name="half-rating-read"
                    defaultValue={pair[1].rating}
                    precision={0.1}
                    readOnly
                  />
                </Stack>
                <span className="ml-1">({pair[1].reviewCount})</span>
              </div>
              <p className="italic">{pair[1].category} restaurant</p>
            </div>
            <img
              src={pair[1].imageUrl}
              alt={pair[1].name}
              style={{ width: "100%", height: "550px", objectFit: "cover" }}
              className={styles.reverseTrapezoid}
            />
          </div>
        </div>
      </div>
    );
  } else {
    return <p>Loading...</p>;
  }
}