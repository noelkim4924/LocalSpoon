import React from 'react'
import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="flex items-center  px-[16%] py-2 bg-gray-100 shadow">
      <Link href="/">
        <img
          src="/images/logo.png"
          alt="logo"
          className="h-[100px] w-auto"
        />
      </Link>
    </nav>
  )
}
