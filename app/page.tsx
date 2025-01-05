"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false); // 클라이언트 상태 확인
  const sliderRef = useRef<HTMLDivElement>(null);
  const slideCount = 3;
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // 클라이언트에서만 상태 변경
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
    }, 3000);

    return () => clearInterval(interval);
  }, [isClient]);

  useEffect(() => {
    if (sliderRef.current && isClient) {
      sliderRef.current.scrollTo({
        left: sliderRef.current.offsetWidth * currentSlide,
        behavior: "smooth",
      });
    }
  }, [currentSlide, isClient]);

  const goToSlide = (index: number) => {
    if (isClient) setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div
          className="relative w-[600px] h-[600px] overflow-hidden bg-white shadow-lg"
          style={{ borderRadius: "80px" }}
        >
          <div
            ref={sliderRef}
            className="flex transition-transform duration-300"
            style={{ width: `${slideCount * 100}%` }}
          >
            {[1, 2, 3].map((_, index) => (
              <div
                key={`slide-${index}`} // 키 확인
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

        <div className="flex justify-center mt-4">
          {[...Array(slideCount)].map((_, index) => (
            <button
              key={`indicator-${index}`}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full mx-1 ${
                currentSlide === index ? "bg-gray-800" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>

        <button
          onClick={() => router.push("/Home")}
          className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600"
        >
          Start
        </button>
      </div>
    </div>
  );
}
