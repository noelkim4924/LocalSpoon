"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";


const StartingLottie = dynamic(() => import("@/components/Lottie/StartingLottie"), {
  ssr: false,
});

export default function LoadingPage() {
  const router = useRouter();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Home");
    }, 2100);

    return () => clearTimeout(timer);
  }, [router]);

  return <StartingLottie />;
}
