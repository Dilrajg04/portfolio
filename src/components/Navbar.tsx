"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useAudio } from "@/context/AudioContext";

const SONG = "The Plan";
const ARTIST = "Travis Scott";

export default function Navbar() {
  const { playing, toggle: toggleAudio } = useAudio();
  const [open, setOpen] = useState(false);
  const heartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e: MouseEvent) {
      if (heartRef.current && !heartRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-16 py-6 bg-white/80 backdrop-blur-sm border-b border-zinc-100/60">
      <div className="flex items-center gap-4">

        {/* Heart + meaning dropdown */}
        <div ref={heartRef} className="relative">
          <button onClick={() => setOpen(v => !v)} aria-label="What does Dilraj mean?">
            <svg width="56" height="48" viewBox="0 0 7 6" shapeRendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="0" width="1" height="1" fill="#0a0a0a"/>
              <rect x="2" y="0" width="1" height="1" fill="#0a0a0a"/>
              <rect x="4" y="0" width="1" height="1" fill="#0a0a0a"/>
              <rect x="5" y="0" width="1" height="1" fill="#0a0a0a"/>
              <rect x="0" y="1" width="1" height="1" fill="#0a0a0a"/>
              <rect x="1" y="1" width="1" height="1" fill="#0a0a0a"/>
              <rect x="2" y="1" width="1" height="1" fill="#0a0a0a"/>
              <rect x="3" y="1" width="1" height="1" fill="#0a0a0a"/>
              <rect x="4" y="1" width="1" height="1" fill="#0a0a0a"/>
              <rect x="5" y="1" width="1" height="1" fill="#0a0a0a"/>
              <rect x="6" y="1" width="1" height="1" fill="#0a0a0a"/>
              <rect x="0" y="2" width="1" height="1" fill="#0a0a0a"/>
              <rect x="1" y="2" width="1" height="1" fill="#0a0a0a"/>
              <rect x="2" y="2" width="1" height="1" fill="#0a0a0a"/>
              <rect x="3" y="2" width="1" height="1" fill="#0a0a0a"/>
              <rect x="4" y="2" width="1" height="1" fill="#0a0a0a"/>
              <rect x="5" y="2" width="1" height="1" fill="#0a0a0a"/>
              <rect x="6" y="2" width="1" height="1" fill="#0a0a0a"/>
              <rect x="1" y="3" width="1" height="1" fill="#0a0a0a"/>
              <rect x="2" y="3" width="1" height="1" fill="#0a0a0a"/>
              <rect x="3" y="3" width="1" height="1" fill="#0a0a0a"/>
              <rect x="4" y="3" width="1" height="1" fill="#0a0a0a"/>
              <rect x="5" y="3" width="1" height="1" fill="#0a0a0a"/>
              <rect x="2" y="4" width="1" height="1" fill="#0a0a0a"/>
              <rect x="3" y="4" width="1" height="1" fill="#0a0a0a"/>
              <rect x="4" y="4" width="1" height="1" fill="#0a0a0a"/>
              <rect x="3" y="5" width="1" height="1" fill="#0a0a0a"/>
            </svg>
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                className="absolute top-full left-0 mt-3 w-64 bg-white border border-zinc-200 rounded-2xl p-5 shadow-lg shadow-zinc-100"
              >
                <p className="font-display font-bold text-[#0a0a0a] text-base mb-1">Dilraj <span className="font-mono font-normal text-zinc-400 text-sm">ਦਿਲਰਾਜ</span></p>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  From Punjabi — <span className="text-[#0a0a0a] font-medium">dil</span> (heart) + <span className="text-[#0a0a0a] font-medium">raj</span> (king).<br />
                  King of hearts.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Now Playing — desktop pill */}
        <button
          onClick={toggleAudio}
          className="hidden lg:flex items-center gap-3 border border-zinc-200 hover:border-zinc-400 rounded-full pl-2 pr-4 py-2 transition-colors duration-200"
          aria-label={playing ? "Pause" : "Play"}
        >
          <div className="w-8 h-8 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0">
            <AnimatePresence mode="wait" initial={false}>
              {playing ? (
                <motion.svg key="pause" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.1 }} width="10" height="10" viewBox="0 0 10 10" fill="white">
                  <rect x="1.5" y="1.5" width="3" height="7" rx="0.75"/>
                  <rect x="5.5" y="1.5" width="3" height="7" rx="0.75"/>
                </motion.svg>
              ) : (
                <motion.svg key="play" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.1 }} width="10" height="10" viewBox="0 0 10 10" fill="white">
                  <path d="M2.5 1.5l6 3.5-6 3.5V1.5z"/>
                </motion.svg>
              )}
            </AnimatePresence>
          </div>
          <div className="text-left">
            <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase leading-none mb-1">
              {playing ? "Now Playing" : "Currently Into"}
            </p>
            <p className="text-sm font-display font-semibold text-[#0a0a0a] leading-none">{SONG} · <span className="font-normal text-zinc-400">{ARTIST}</span></p>
          </div>
          <div className="flex items-end gap-[2px] h-4 ml-1">
            {[0.4, 0.9, 0.6, 1, 0.5].map((h, i) => (
              <motion.span key={i} className="w-[2px] rounded-full bg-zinc-300"
                animate={playing ? { scaleY: [h, 1, h * 0.4, 0.9, h] } : { scaleY: 0.3 }}
                transition={playing ? { duration: 0.7 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 } : { duration: 0.3 }}
                style={{ height: "100%", originY: 1 }}
              />
            ))}
          </div>
        </button>


      </div>

      <div className="flex items-center gap-8 text-sm text-zinc-500">
        <a href="#work" className="hover:text-[#0a0a0a] transition-colors duration-200">Work</a>
        <a href="#about" className="hover:text-[#0a0a0a] transition-colors duration-200">About</a>
        <a href="#projects" className="hover:text-[#0a0a0a] transition-colors duration-200">Projects</a>
        <Link href="mailto:dgrewal2004@gmail.com" className="border border-zinc-200 hover:border-zinc-400 rounded-full px-4 py-1.5 text-[#0a0a0a] transition-colors duration-200">
          Contact
        </Link>
      </div>
    </nav>
  );
}
