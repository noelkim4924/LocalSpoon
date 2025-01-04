"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Restaurant {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  distance: number;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BracketSelectModal({ isOpen, onClose }: ModalProps) {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const router = useRouter();

  useEffect(() => {
    // 모달이 열릴 때만 localStorage에서 'restaurants' 불러오기
    if (isOpen) {
      const storedData = localStorage.getItem("restaurants");
      if (storedData) {
        setAllRestaurants(JSON.parse(storedData));
      } else {
        setAllRestaurants([]);
      }
    }
  }, [isOpen]);

  // '4', '16', '32' 버튼 클릭 시 호출
  const handleSelectBracket = (size: number) => {
    if (allRestaurants.length < size) {
      alert(`현재 ${allRestaurants.length}개의 레스토랑밖에 없어요. (필요: ${size}개)`);
      return;
    }

    // 50개 중에서 size개 무작위 추출
    const shuffled = [...allRestaurants].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, size);

    // 다른 키로 저장해두면 Vs 페이지에서 가져다 사용할 수 있음
    localStorage.setItem("restaurantsForBracket", JSON.stringify(selected));

    // 모달 닫고 VS 페이지로 이동
    onClose();
    router.push("/Vs"); 
  };

  // 모달이 닫힌 상태라면 아무것도 렌더링하지 않음
  if (!isOpen) return null;

  return (
    // 모달 배경 (검은색 반투명)
    <div className="fixed inset-0 çç flex items-center justify-center bg-black bg-opacity-50">
      {/* 모달 컨텐츠 */}
      <div className="bg-white p-6 rounded shadow-lg min-w-[280px]">
        <h2 className="text-lg font-bold mb-4">
          총 {allRestaurants.length}개의 맛집을 찾았습니다.
        </h2>
        <p className="mb-4">몇 강으로 진행하시겠습니까?</p>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleSelectBracket(4)}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            4강
          </button>
          <button
            onClick={() => handleSelectBracket(16)}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            16강
          </button>
          <button
            onClick={() => handleSelectBracket(32)}
            className="bg-blue-500 text-white px-3 py-2 rounded"
          >
            32강
          </button>
        </div>
        <button onClick={onClose} className="px-3 py-2 border rounded">
          닫기
        </button>
      </div>
    </div>
  );
}
