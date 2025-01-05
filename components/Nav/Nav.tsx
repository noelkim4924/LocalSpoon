"use client";

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Nav() {
  return (
    <nav className="flex items-center  px-[16%] py-2 bg-[#FFF3DE] shadow">
      <Link href="/Home">
        <Image 
          src="/images/logo.png"
          alt="logo"
          className="h-[100px] w-auto"
        />
      </Link>
    </nav>
  )
}
