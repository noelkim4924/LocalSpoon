"use client";

import React, { useState, useEffect } from "react";
import Lottie from "react-lottie-player";

export default function WaitingLottie() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(interval);
  }, []);


  const animatedDots = ["", ".", ". .", ". . ."][dotCount];

  return (
    <div
      style={{
        backgroundColor: "#FFF3DE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: 600,
          height: 600,
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <Lottie
          loop
          play
          path="/data/Animation_sun.json"
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>


      <p
        style={{
          marginTop: 16,
          fontSize: 40,
          color: "black",
          textShadow: `
            -1px  0   #000,
             1px  0   #000,
             0   -1px #000,
             0    1px #000
          `,
        }}
      >
        Waiting for Result {animatedDots}
      </p>
    </div>
  );
}
