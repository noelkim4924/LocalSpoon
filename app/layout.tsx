"use client";

import { usePathname } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import Nav from "@/components/Nav/Nav";
import FooterWrapper from "@/components/Footer/FooterWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideNavFooterPaths = ["/", "/Loading1", "/Loading2"];
  const shouldHideNavFooter = hideNavFooterPaths.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {!shouldHideNavFooter && <Nav />}

        {children}

        {!shouldHideNavFooter && <FooterWrapper />}
      </body>
    </html>
  );
}
