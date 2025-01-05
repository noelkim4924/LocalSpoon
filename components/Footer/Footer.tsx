'use client';

const Footer = () => {
  return (
<footer className="w-full bg-gray-800 text-gray-300 py-3">
  <div className="max-w-6xl mx-auto grid grid-cols-3 gap-4 items-center">
    {/* 왼쪽 컬럼: 로고 및 정보 */}
    <div className="text-left">
      <h2 className="font-bold text-lg">My Logo</h2>
      <p className="text-sm">Contact Information</p>
      <p className="text-sm">Privacy Policy</p>
    </div>

    {/* 중앙 컬럼: 사이트맵 */}
    <div className="text-center">
      <h3 className="font-bold text-lg">Site Map</h3>
      <ul className="space-y-1">
        <li>My Business</li>
        <li>My Products</li>

        <li>Support</li>
      </ul>
      {/* 하단에 Copyright 추가 */}
      <p className="text-sm mt-3">Copyright © 2025</p>
    </div>

    {/* 오른쪽 컬럼: 구독 */}
    <div className="text-right">
      <h3 className="font-bold text-lg">Subscribe</h3>
      <input
        type="email"
        placeholder="Email address"
        className="p-2 rounded w-48 mb-2 text-black"
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Subscribe
      </button>
    </div>
  </div>
</footer>


  );
};

export default Footer;
