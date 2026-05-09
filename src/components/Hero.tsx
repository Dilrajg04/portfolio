"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAudio } from "@/context/AudioContext";

const SONG = "The Plan";
const ARTIST = "Travis Scott";

const ease = [0.22, 1, 0.36, 1] as const;

const lineVariant = {
  hidden: { opacity: 0, y: 36 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease, delay: i * 0.08 },
  }),
};

const digitColors = [
  "#f43f5e", "#f97316", "#eab308", "#22c55e", "#06b6d4",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6", "#f59e0b",
];

const LINE1 = "Dilraj";
const LINE2 = "Grewal";
const LINES = [LINE1, LINE2];
const FLAT = [...LINE1.split(""), ...LINE2.split("")];
const SKIP = new Set([" ", ".", ","]);

const lineMap = LINES.map((line, li) => {
  const offset = LINES.slice(0, li).reduce((a, l) => a + l.length, 0);
  return line.split("").map((char, ci) => ({ char, idx: offset + ci }));
});

function randomDigit() { return String(~~(Math.random() * 10)); }

function decode(setChars: (fn: (prev: string[]) => string[]) => void, delay = 0) {
  FLAT.forEach((originalChar, i) => {
    if (SKIP.has(originalChar)) return;
    setTimeout(() => {
      setChars(prev => prev.map((c, j) => j === i ? originalChar : c));
    }, delay + i * 65);
  });
}

/* ── Mobile Now Playing ── */
function MobilePlayer() {
  const { playing, toggle } = useAudio();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-3 mt-5"
    >
      <button
        onClick={toggle}
        className="w-9 h-9 rounded-full bg-[#0a0a0a] flex items-center justify-center shrink-0"
        aria-label={playing ? "Pause" : "Play"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {playing ? (
            <motion.svg key="pause" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.1 }} width="11" height="11" viewBox="0 0 10 10" fill="white">
              <rect x="1.5" y="1.5" width="3" height="7" rx="0.75"/>
              <rect x="5.5" y="1.5" width="3" height="7" rx="0.75"/>
            </motion.svg>
          ) : (
            <motion.svg key="play" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.1 }} width="11" height="11" viewBox="0 0 10 10" fill="white">
              <path d="M2.5 1.5l6 3.5-6 3.5V1.5z"/>
            </motion.svg>
          )}
        </AnimatePresence>
      </button>

      <div>
        <p className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase leading-none mb-0.5">
          {playing ? "Now Playing" : "Currently Into"}
        </p>
        <p className="text-xs font-display font-semibold text-[#0a0a0a] leading-none">
          {SONG} · <span className="font-normal text-zinc-400">{ARTIST}</span>
        </p>
      </div>

      {/* Visualizer bars */}
      <div className="flex items-end gap-[3px] h-5 ml-1">
        {[0.4, 0.9, 0.6, 1, 0.5, 0.75, 0.3].map((h, i) => (
          <motion.span
            key={i}
            className="w-[2.5px] rounded-full bg-zinc-300"
            animate={playing ? { scaleY: [h, 1, h * 0.4, 0.9, h] } : { scaleY: 0.25 }}
            transition={playing ? { duration: 0.7 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 } : { duration: 0.3 }}
            style={{ height: "100%", originY: 1 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/* ── ScrambleHeadline ── */
function ScrambleHeadline() {
  const isMobile = useIsMobile();
  const [chars, setChars] = useState([...FLAT]);
  const refs = useRef<(HTMLSpanElement | null)[]>(new Array(FLAT.length).fill(null));
  const mousePos = useRef({ x: -9999, y: -9999 });
  const decoding = useRef(false);

  /* Desktop: cursor scramble */
  useEffect(() => {
    if (isMobile) return;
    function onMove(e: MouseEvent) { mousePos.current = { x: e.clientX, y: e.clientY }; }
    function onLeave() { mousePos.current = { x: -9999, y: -9999 }; setChars([...FLAT]); }
    const id = setInterval(() => {
      const { x, y } = mousePos.current;
      setChars(FLAT.map((c, i) => {
        if (SKIP.has(c)) return c;
        const el = refs.current[i];
        if (!el) return c;
        const r = el.getBoundingClientRect();
        const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2));
        return d < 80 ? randomDigit() : c;
      }));
    }, 60);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseleave", onLeave); clearInterval(id); };
  }, [isMobile]);

  /* Mobile: auto-decode on mount, tap to re-trigger */
  useEffect(() => {
    if (!isMobile) return;
    // Start fully scrambled, decode left to right
    setChars(FLAT.map(c => SKIP.has(c) ? c : randomDigit()));
    decode(setChars, 300);
  }, [isMobile]);

  function onTap() {
    if (!isMobile || decoding.current) return;
    decoding.current = true;
    setChars(FLAT.map(c => SKIP.has(c) ? c : randomDigit()));
    decode(setChars, 80);
    setTimeout(() => { decoding.current = false; }, 80 + FLAT.length * 65 + 200);
  }

  return (
    <motion.div initial="hidden" animate="show" onClick={onTap} className={isMobile ? "cursor-pointer select-none" : ""}>
      <h1
        className="font-display font-extrabold leading-[0.9] tracking-[-0.03em] text-[#0a0a0a] uppercase"
        style={{ fontSize: isMobile ? "clamp(2rem, 17vw, 5rem)" : "clamp(3.5rem, 12vw, 12rem)" }}
        aria-label={LINES.join(" ")}
      >
        {lineMap.map((line, li) => (
          <motion.span key={li} custom={li} variants={lineVariant} className="block overflow-hidden">
            <span className="block">
              {line.map(({ char, idx }) => {
                const scrambled = !SKIP.has(char) && chars[idx] !== char;
                return (
                  <span
                    key={idx}
                    ref={el => { refs.current[idx] = el; }}
                    style={{
                      display: char === " " ? "inline" : "inline-block",
                      color: scrambled ? digitColors[parseInt(chars[idx])] : undefined,
                    }}
                    className={scrambled ? "font-mono" : ""}
                  >
                    {chars[idx]}
                  </span>
                );
              })}
            </span>
          </motion.span>
        ))}
      </h1>
      {isMobile && <MobilePlayer />}
    </motion.div>
  );
}

/* ── Hero ── */
export default function Hero() {
  return (
    <section className="relative min-h-screen px-6 lg:px-16 pt-24 pb-16 flex flex-col">

      {/* Mobile headshot — full width ghost, blended */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 0.9, ease, delay: 0.1 }}
        className="lg:hidden relative w-full h-[340px] mb-4 overflow-hidden rounded-2xl"
      >
        <Image src="/headshot.png" alt="Dilraj Grewal" fill priority className="object-cover object-top" sizes="100vw" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-white via-white/60 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/5 bg-gradient-to-b from-white to-transparent" />
      </motion.div>

      {/* Desktop headshot */}
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 0.35, x: 0 }}
        transition={{ duration: 0.8, ease, delay: 0.2 }}
        className="hidden lg:block absolute top-16 right-8 w-[480px] aspect-[3/4] rounded-2xl overflow-hidden -z-10"
      >
        <Image src="/headshot.png" alt="Dilraj Grewal" fill priority className="object-cover object-top" sizes="480px" />
        <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-white via-white/60 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white to-transparent" />
        <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-white to-transparent" />
      </motion.div>

      <div className="flex-1 hidden lg:block" />

      <ScrambleHeadline />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease, delay: 0.55 }}
        className="mt-10 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6"
      >
        <div className="flex flex-wrap items-center gap-5">
          <a href="#work" className="inline-flex items-center gap-2 bg-[#0a0a0a] text-white font-display font-semibold text-sm px-6 py-3 rounded-full hover:bg-zinc-800 transition-colors duration-200">
            View My Work <span aria-hidden>→</span>
          </a>
          <a href="https://larper.co" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 border border-zinc-200 text-[#0a0a0a] font-display font-semibold text-sm px-6 py-3 rounded-full hover:border-zinc-400 transition-colors duration-200">
            larper.co <span aria-hidden className="text-zinc-400 hidden sm:inline">↗</span>
          </a>
        </div>
        <p className="text-sm text-zinc-500 max-w-[280px] leading-relaxed sm:text-right">
          Working at the seams of numbers,<br />code, and narrative.
        </p>
      </motion.div>
    </section>
  );
}
