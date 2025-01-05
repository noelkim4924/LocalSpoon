// app/Loading2/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// 동적 임포트 + ssr: false 옵션
// => 서버 사이드 렌더링 시에는 이 컴포넌트를 로드하지 않음
const WaitingLottie = dynamic(() => import("@/components/Lottie/WaitingLottie"), {
  ssr: false,
});

export default function AnotherLoadingPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // 2초 뒤 /Ranking 페이지로 이동
      router.push("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return <WaitingLottie />;
}
