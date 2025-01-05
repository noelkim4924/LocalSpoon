"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-gray-300 py-3">
      <div className="max-w-6xl mx-auto space-y-2">
        <div className="grid grid-cols-3 items-center">
          <div className="text-left">
            <h3 className="font-bold text-lg">Local Spoon</h3>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg mr-28">Developed by</h3>
          </div>
          <div className="text-right">
            <h3 className="font-bold text-lg">Designed by</h3>
          </div>
        </div>

        <div className="grid grid-cols-3 items-start">
          <div className="text-left">
            <p className="text-sm"><br/></p>
            <p className="text-sm mt-2">Copyright © 2025</p>
          </div>

          <div className="text-center">
            <div className="space-y-1">
              <p>
                <Link href="https://www.linkedin.com/in/wooyong-kim-211339206/" className="text-[#F99D3A] hover:underline">
                  Noel Kim
                </Link>{" "}
                &amp;{" "}
                <Link href="https://www.linkedin.com/in/ellen-jung-702930225/" className="text-[#F99D3A] hover:underline mr-16">
                  Ellen Jung
                </Link>
              </p>
              <p>
                <Link href="https://www.linkedin.com/in/siwoonlim/" className="text-[#F99D3A] hover:underline ml-3">
                  Siwoon Lim
                </Link>{" "}
                &amp;{" "}
                <Link href="https://www.linkedin.com/in/seungyeop1993/" className="text-[#F99D3A] hover:underline">
                  Seungyeop Hyun
                </Link>
              </p>
            </div>
          </div>

          <div className="text-right">
            <Link href="https://www.linkedin.com/in/alishas07/" className="text-[#F99D3A] hover:underline mr-5">
              Dayeon Seo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
