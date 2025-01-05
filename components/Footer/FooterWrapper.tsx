"use client";

import Footer from "./Footer";
import { usePathname } from "next/navigation";

const FooterWrapper = () => {
  const pathname = usePathname();

  // 랜딩 페이지("/")에서는 Footer를 렌더링하지 않음
  if (pathname === "/") {
    return null;
  }

  return <Footer />;
};

export default FooterWrapper;
