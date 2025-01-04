"use client";
import { useEffect, useState } from "react";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  distance: number;
}


function removeDuplicatesKeepingLast(array: Restaurant[]): Restaurant[] {

  const reversed = [...array].reverse();

  const filtered = reversed.filter(
    (item, index, self) => self.findIndex((r) => r.id === item.id) === index
  );
 
  return filtered.reverse();
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<Restaurant[]>([]);

  useEffect(() => {
  
    const bracketData = localStorage.getItem("restaurantsForBracket");
   
    const finalData = localStorage.getItem("finalRanking");

    if (!bracketData || !finalData) {
      alert("아직 최종 랭킹 데이터가 없습니다!");
      return;
    }

    const bracketAll = JSON.parse(bracketData) as Restaurant[];
    const selectedList = JSON.parse(finalData) as Restaurant[];

    const unique = removeDuplicatesKeepingLast(selectedList);
    const finalList = [...unique].reverse(); 


    const selectedIds = new Set(finalList.map((r) => r.id));
    const losers = bracketAll.filter((r) => !selectedIds.has(r.id));


    const combined = [...finalList, ...losers];


    const top8 = combined.slice(0, 8);

    setRanking(top8);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        최종 결과 (8강)
      </h1>

      {ranking.length === 0 ? (
        <p>데이터가 없습니다.</p>
      ) : (
        <ol className="list-decimal list-inside">
          {ranking.map((res, idx) => (
            <li key={`${res.id}-${idx}`}>
              {idx + 1}위: {res.name}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
