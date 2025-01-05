"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import StartingLottie from "@/components/Lottie/StartingLottie";

export default function LoadingPage1() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 2100);

    return () => clearTimeout(timer);
  }, [router]);

  return <StartingLottie />;
}
