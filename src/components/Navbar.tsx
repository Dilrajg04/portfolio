"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-6 bg-white/80 backdrop-blur-sm border-b border-zinc-100/60">
      <svg width="56" height="48" viewBox="0 0 7 6" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
        {/* Row 0 */}
        <rect x="1" y="0" width="1" height="1" fill="#0a0a0a"/>
        <rect x="2" y="0" width="1" height="1" fill="#0a0a0a"/>
        <rect x="4" y="0" width="1" height="1" fill="#0a0a0a"/>
        <rect x="5" y="0" width="1" height="1" fill="#0a0a0a"/>
        {/* Row 1 */}
        <rect x="0" y="1" width="1" height="1" fill="#0a0a0a"/>
        <rect x="1" y="1" width="1" height="1" fill="#0a0a0a"/>
        <rect x="2" y="1" width="1" height="1" fill="#0a0a0a"/>
        <rect x="3" y="1" width="1" height="1" fill="#0a0a0a"/>
        <rect x="4" y="1" width="1" height="1" fill="#0a0a0a"/>
        <rect x="5" y="1" width="1" height="1" fill="#0a0a0a"/>
        <rect x="6" y="1" width="1" height="1" fill="#0a0a0a"/>
        {/* Row 2 */}
        <rect x="0" y="2" width="1" height="1" fill="#0a0a0a"/>
        <rect x="1" y="2" width="1" height="1" fill="#0a0a0a"/>
        <rect x="2" y="2" width="1" height="1" fill="#0a0a0a"/>
        <rect x="3" y="2" width="1" height="1" fill="#0a0a0a"/>
        <rect x="4" y="2" width="1" height="1" fill="#0a0a0a"/>
        <rect x="5" y="2" width="1" height="1" fill="#0a0a0a"/>
        <rect x="6" y="2" width="1" height="1" fill="#0a0a0a"/>
        {/* Row 3 */}
        <rect x="1" y="3" width="1" height="1" fill="#0a0a0a"/>
        <rect x="2" y="3" width="1" height="1" fill="#0a0a0a"/>
        <rect x="3" y="3" width="1" height="1" fill="#0a0a0a"/>
        <rect x="4" y="3" width="1" height="1" fill="#0a0a0a"/>
        <rect x="5" y="3" width="1" height="1" fill="#0a0a0a"/>
        {/* Row 4 */}
        <rect x="2" y="4" width="1" height="1" fill="#0a0a0a"/>
        <rect x="3" y="4" width="1" height="1" fill="#0a0a0a"/>
        <rect x="4" y="4" width="1" height="1" fill="#0a0a0a"/>
        {/* Row 5 */}
        <rect x="3" y="5" width="1" height="1" fill="#0a0a0a"/>
      </svg>
      <div className="flex items-center gap-8 text-sm text-zinc-500">
        <a href="#work" className="hover:text-[#0a0a0a] transition-colors duration-200">
          Work
        </a>
        <a href="#about" className="hover:text-[#0a0a0a] transition-colors duration-200">
          About
        </a>
        <a href="#projects" className="hover:text-[#0a0a0a] transition-colors duration-200">
          Projects
        </a>
        <Link
          href="mailto:dgrewal2004@gmail.com"
          className="border border-zinc-200 hover:border-zinc-400 rounded-full px-4 py-1.5 text-[#0a0a0a] transition-colors duration-200"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
