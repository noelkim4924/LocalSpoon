"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // useRouter import

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideCount = 3; // 이미지 슬라이드 개수
  const router = useRouter(); // Next.js useRouter

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount); // 자동 슬라이드
    }, 3000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 클리어
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.offsetWidth * currentSlide,
        behavior: "smooth",
      });
    }
  }, [currentSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index); // 인디케이터 클릭 시 슬라이드 이동
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* 슬라이드 박스 */}
        <div
          className="relative w-[600px] h-[600px] overflow-hidden bg-white shadow-lg"
          style={{ borderRadius: "80px" }} // 라운드 비율 조정 가능
        >
          <div
            ref={sliderRef}
            className="flex transition-transform duration-300"
            style={{ width: `${slideCount * 100}%` }}
          >
            {[1, 2, 3].map((_, index) => (
              <div
                key={index}
                className="w-[600px] h-[600px] flex-shrink-0 bg-gray-300 flex items-center justify-center"
              >
                <img
                  src={`https://via.placeholder.com/400?text=Slide+${index + 1}`}
                  alt={`Slide ${index + 1}`}
                  className="rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 슬라이드 인디케이터 */}
        <div className="flex justify-center mt-4">
          {[...Array(slideCount)].map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full mx-1 ${
                currentSlide === index ? "bg-gray-800" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>

        {/* Start 버튼 */}
        <button
          onClick={() => router.push("/Home")} // /Home으로 이동
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600"
        >
          Start
        </button>
      </div>
    </div>
  );
}
