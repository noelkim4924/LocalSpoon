// app/Loading2/page.tsx
"use client";
export const dynamic = "force-dynamic"; // Next.js 설정(정적 생성 비활성화)

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import nextDynamic from "next/dynamic"; // 이름 변경 (기존 'dynamic' -> 'nextDynamic')

// 동적 임포트 + ssr: false 옵션
const WaitingLottie = nextDynamic(() => import("@/components/Lottie/WaitingLottie"), {
  ssr: false,
});

export default function AnotherLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/Ranking");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return <WaitingLottie />;
}
