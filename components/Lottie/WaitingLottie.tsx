"use client";

import Lottie from "react-lottie-player";

export default function WaitingLottie() {
  return (
    <div
      style={{
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
        Waiting for Result . . .
      </p>

      <img
        src="/images/localspoon_logo.png"
        alt="Local Spoon Logo"
        style={{ marginTop: 12, width: 100, height: "auto" }}
      />
    </div>
  );
}
