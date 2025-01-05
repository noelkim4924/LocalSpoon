"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import WaitingLottie from "@/components/Lottie/WaitingLottie";

export default function LoadingPage2() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/ranking"); // 2초 뒤 /Ranking 페이지로 이동
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return <WaitingLottie />;
}
