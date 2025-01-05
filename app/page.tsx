"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  const slides = [
    "/images/logo.png",
    "/images/round2.png",
    "/images/round3.png",
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isClient, slides.length]);

  const goToSlide = (index: number) => {
    if (isClient) setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center">
        
        <div
          className="relative w-[600px] h-[600px] overflow-hidden bg-white"
          style={{ borderRadius: "80px" }}
        >
          <div
            className="flex transition-transform duration-300"
            style={{
              width: `${slides.length * 600}px`,
              transform: `translateX(-${currentSlide * 600}px)`,
            }}
          >
            {slides.map((slideSrc, index) => (
              <div
                key={`slide-${index}`}
                className="flex-shrink-0 bg-gray-100 flex items-center justify-center"
                style={{ width: "600px", height: "600px" }}
              >
                <Image
                  src={slideSrc}
                  alt={`Slide ${index + 1}`}
                  width={600}
                  height={600}
                  className="rounded"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-4">
          {slides.map((_, index) => (
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
