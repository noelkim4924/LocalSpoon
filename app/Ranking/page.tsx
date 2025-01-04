"use client";
import { useEffect, useState } from "react";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  distance: number;
}

// "가장 마지막에 선택된 레스토랑만 남기고 중복 제거" 예시 함수
function removeDuplicatesKeepingLast(array: Restaurant[]): Restaurant[] {
  // 1) 뒤집는다
  const reversed = [...array].reverse();
  // 2) 뒤에서부터 처음 만난 레스토랑만 남김
  const filtered = reversed.filter(
    (item, index, self) => self.findIndex((r) => r.id === item.id) === index
  );
  // 3) 다시 뒤집어서 원래 순서로
  return filtered.reverse();
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<Restaurant[]>([]);

  useEffect(() => {
    const data = localStorage.getItem("finalRanking");
    if (data) {
      const parsed = JSON.parse(data) as Restaurant[];

      // 1) 중복 제거 (마지막 선택을 우선)
      const unique = removeDuplicatesKeepingLast(parsed);

      // 2) '마지막으로 선택된 레스토랑'이 목록의 맨 앞(1위)로 오도록 배열 뒤집기
      //    즉, 마지막 선택 = 1위, 그 전 선택 = 2위...
      const finalList = [...unique].reverse();

      // 3) 상위 8개만 추출
      const top8 = finalList.slice(0, 8);

      setRanking(top8);
    } else {
      alert("아직 최종 랭킹 데이터가 없습니다!");
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">
        최종 결과 (1위 = 마지막 선택, 최대 8등까지만)
      </h1>

      {ranking.length === 0 ? (
        <p>데이터가 없습니다.</p>
      ) : (
        <ol className="list-decimal list-inside">
          {ranking.map((res, idx) => (
            <li key={`${res.id}-${idx}`}>
              {/* reversed 배열에서 idx=0이 최종 우승 (1위) */}
              {idx + 1}위: {res.name}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
