"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  distance: number;
}

export default function VsPage() {
  const router = useRouter();

  const [tournamentList, setTournamentList] = useState<Restaurant[]>([]);
  const [currentRound, setCurrentRound] = useState<Restaurant[]>([]);
  const [matchIndex, setMatchIndex] = useState(0);
  const [winners, setWinners] = useState<Restaurant[]>([]);
  const [roundNumber, setRoundNumber] = useState(1);

  // 전체 선택 순서를 기록하는 배열(중복 제거/정리는 RankingPage에서)
  const [selectedWinners, setSelectedWinners] = useState<Restaurant[]>([]);

  useEffect(() => {
    // "restaurantsForBracket" 불러오기
    const data = localStorage.getItem("restaurantsForBracket");
    if (!data) {
      alert("No bracket data found. Please select bracket size first.");
      return;
    }
    const parsed: Restaurant[] = JSON.parse(data);

    setTournamentList(parsed);
    setCurrentRound(parsed);
  }, []);

  // 현재 진행 중인 매치에서 2개만 추출
  const pair = currentRound.slice(matchIndex * 2, matchIndex * 2 + 2);

  // 승자를 선택했을 때
  const handleSelectWinner = (winner: Restaurant) => {
    // 이번 라운드 승자
    setWinners((prev) => [...prev, winner]);
    // 전체 선택 순서
    setSelectedWinners((prev) => [...prev, winner]);
    setMatchIndex((prev) => prev + 1);
  };

  useEffect(() => {
    const totalMatches = currentRound.length / 2;

    if (matchIndex === totalMatches && totalMatches !== 0) {
      // 이번 라운드 끝
      if (winners.length === totalMatches) {
        // 라운드 승자가 전부 모임
        if (winners.length === 1) {
          // 우승자 확정
          const finalWinner = winners[0];
          console.log("우승자:", finalWinner);

          // finalRanking 에 전체 클릭 순서 저장
          localStorage.setItem("finalRanking", JSON.stringify(selectedWinners));

          // **자동으로 /ranking 페이지로 이동** (버튼 없이 즉시 이동)
          router.push("/Ranking");
        } else {
          // 다음 라운드 진행
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

  // 아직 남은 매치가 있다면
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
    // 라운드 처리 중
    return <p>라운드 종료 처리 중...</p>;
  }
}
