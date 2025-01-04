"use client";
import { useEffect, useState } from "react";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  distance: number;
}

export default function VsPage() {
  const [tournamentList, setTournamentList] = useState<Restaurant[]>([]);
  const [currentRound, setCurrentRound] = useState<Restaurant[]>([]);
  const [matchIndex, setMatchIndex] = useState(0); // 현재 어느 매치(짝) 진행 중인지
  const [winners, setWinners] = useState<Restaurant[]>([]); // 승자 모으기
  const [roundNumber, setRoundNumber] = useState(1);

  useEffect(() => {
    // "restaurantsForBracket" 불러오기
    const data = localStorage.getItem("restaurantsForBracket");
    if (!data) {
      alert("No bracket data found. Please select bracket size first.");
      return;
    }
    const parsed: Restaurant[] = JSON.parse(data);
    setTournamentList(parsed);

    // 첫 라운드 구성
    // parsed의 길이가 32라면 32강, 16이면 16강, ...
    setCurrentRound(parsed);
  }, []);

  // 현재 진행 중인 매치의 두 레스토랑
  const pair = currentRound.slice(matchIndex * 2, matchIndex * 2 + 2);

  // 승자를 선택했을 때
  const handleSelectWinner = (winner: Restaurant) => {
    // winner를 winners 배열에 추가
    setWinners((prev) => [...prev, winner]);

    // 다음 매치로 이동
    setMatchIndex((prev) => prev + 1);
  };

  // 매치가 모두 끝났을 때 (ex: 32개 → 16개의 매치가 16번 끝나면)
  useEffect(() => {
    // currentRound의 길이가 32면 매치 수 = 16
    const totalMatches = currentRound.length / 2;

    if (matchIndex === totalMatches && totalMatches !== 0) {
      // 한 라운드(32강)가 끝난 상태
      if (winners.length === totalMatches) {
        // winners 배열이 이번 라운드의 승자들로 다 찼을 때
        if (winners.length === 1) {
          // 우승자 확정
          alert(`우승: ${winners[0].name}`);
          // 여기서 끝낼지, 별도 페이지로 이동할지?
        } else {
          // 다음 라운드로 이동 (16강 → 8강, etc)
          setCurrentRound(winners);
          setWinners([]);
          setMatchIndex(0);
          setRoundNumber((prev) => prev + 1);
        }
      }
    }
  }, [matchIndex, winners, currentRound]);

  if (!tournamentList.length) {
    return <p>Loading bracket data...</p>;
  }

  // 아직 이번 라운드에서 처리해야 할 매치가 남아있다면(pair.length가 2)
  if (pair.length === 2) {
    return (
      <div style={{ padding: "16px" }}>
        <h2>
          {tournamentList.length}강 토너먼트 - Round {roundNumber},{" "}
          매치 {matchIndex + 1} / {currentRound.length / 2}
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
            </div>
          ))}
        </div>
        <p>클릭하여 승자를 선택하세요.</p>
      </div>
    );
  } else {
    // 라운드가 진행 중이지만, 모든 매치를 처리한 상태라면 '잠시 대기'
    return <p>라운드 종료 처리 중...</p>;
  }
}
