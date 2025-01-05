"use client";
import { useState, useEffect } from "react";
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

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BracketSelectModal({ isOpen, onClose }: ModalProps) {
  const [allRestaurants, setAllRestaurants] = useState<Restaurant[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const storedData = localStorage.getItem("restaurants");
      if (storedData) {
        setAllRestaurants(JSON.parse(storedData));
      } else {
        setAllRestaurants([]);
      }
    }
  }, [isOpen]);

  const handleSelectBracket = (size: number) => {
    if (allRestaurants.length < size) {
      alert(`We found ${allRestaurants.length} restaurants. (필요: ${size}개)`);
      return;
    }
    const shuffled = [...allRestaurants].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, size);
    localStorage.setItem("restaurantsForBracket", JSON.stringify(selected));

    onClose();
    router.push("/Vs");
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]"
      onClick={onClose} // Close modal when clicking on the backdrop
    >
      <div
        className="bg-white p-6 rounded-3xl shadow-lg min-w-[280px] max-w-[700px] h-[280px] w-full text-center flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <h2 className="text-[36px] mb-4">
          We found <span className="text-[#F58220] font-bold">{allRestaurants.length}</span> restaurants
        </h2>
        <p className="mb-4">Choose the number of rounds to play:</p>
        <div className="flex gap-2 mt-3 justify-center">
          {allRestaurants.length >= 8 && (
            <button
              onClick={() => handleSelectBracket(8)}
              className="bg-[#FFBF00] px-3 py-2 rounded-[22px] w-[60px] h-[60px] mr-2 text-[18px]"
            >
              8
            </button>
          )}
          {allRestaurants.length >= 16 && (
            <button
              onClick={() => handleSelectBracket(16)}
              className="bg-[#FFDE7D] px-3 py-2 rounded-[22px] w-[60px] h-[60px] mr-2 text-[18px]"
            > 
              16
            </button>
          )}
          {allRestaurants.length > 31 && (
            <button
              onClick={() => handleSelectBracket(32)}
              className="bg-[#FFF5BE] px-3 py-2 rounded-[22px] w-[60px] h-[60px] mr-2 text-[18px]"
            >
              32
            </button>
          )}
        </div>
      </div>
    </div>
  );
}