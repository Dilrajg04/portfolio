"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-6 bg-white/80 backdrop-blur-sm border-b border-zinc-100/60">
      <span className="font-display font-semibold text-sm tracking-tight text-[#0a0a0a]">
        Dilraj Grewal
      </span>
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
