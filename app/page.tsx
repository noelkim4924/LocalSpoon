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
    "/images/landing1.png",
    "/images/landing2.png",
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
    if (isClient) {
      setCurrentSlide(index);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#FFF3DE" }}
    >
      <div className="flex flex-col items-center">
        <div
          className="relative w-[800px] h-[800px] overflow-hidden bg-white"
          style={{ borderRadius: "80px" }}
        >
          <div
            className="flex transition-transform duration-300"
            style={{
              width: `${slides.length * 600}px`,
              transform: `translateX(-${currentSlide * 800}px)`,
            }}
          >
            {slides.map((slideSrc, index) => (
              <div
                key={`slide-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  width: "800px",
                  height: "800px",
                  backgroundColor: "#FFF3DE",
                }}
              >
                <Image
                  src={slideSrc}
                  alt={`Slide ${index + 1}`}
                  width={800}
                  height={800}
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
          className="mt-6 bg-[#F99D3A] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#ed9c46]"
        >
          Start
        </button>
      </div>
    </div>
  );
}
