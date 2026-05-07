"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SONG = "The Plan";
const ARTIST = "Travis Scott";
const SRC = "/The Plan - Travis Scott.mp3";

export default function NowPlaying() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audioRef.current = audio;

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) setProgress(audio.currentTime / audio.duration);
    });

    return () => { audio.pause(); audio.src = ""; };
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play(); setPlaying(true); }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-6 left-6 z-50"
    >
      <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-2xl px-4 py-3 shadow-lg shadow-zinc-100 w-64">
        {/* Play/pause button */}
        <button
          onClick={toggle}
          className="shrink-0 w-9 h-9 rounded-full bg-[#0a0a0a] flex items-center justify-center hover:bg-zinc-700 transition-colors duration-200"
          aria-label={playing ? "Pause" : "Play"}
        >
          <AnimatePresence mode="wait" initial={false}>
            {playing ? (
              <motion.svg key="pause" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.12 }} width="14" height="14" viewBox="0 0 14 14" fill="white">
                <rect x="2" y="2" width="4" height="10" rx="1"/>
                <rect x="8" y="2" width="4" height="10" rx="1"/>
              </motion.svg>
            ) : (
              <motion.svg key="play" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.6, opacity: 0 }} transition={{ duration: 0.12 }} width="14" height="14" viewBox="0 0 14 14" fill="white">
                <path d="M3 2.5l9 4.5-9 4.5V2.5z"/>
              </motion.svg>
            )}
          </AnimatePresence>
        </button>

        <div className="flex-1 min-w-0">
          {/* Label */}
          <p className="text-[9px] font-mono tracking-widest text-zinc-400 uppercase mb-0.5">
            {playing ? "Now Playing" : "Currently Into"}
          </p>

          {/* Song + artist */}
          <p className="text-xs font-display font-semibold text-[#0a0a0a] truncate leading-tight">{SONG}</p>
          <p className="text-[10px] text-zinc-400 truncate">{ARTIST}</p>

          {/* Progress bar */}
          <div className="mt-2 h-0.5 w-full bg-zinc-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#0a0a0a] rounded-full"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        {/* Waveform bars — animate when playing */}
        <div className="shrink-0 flex items-end gap-[2px] h-5">
          {[0.4, 0.7, 1, 0.6, 0.85].map((h, i) => (
            <motion.span
              key={i}
              className="w-[3px] rounded-full bg-zinc-300"
              animate={playing ? { scaleY: [h, 1, h * 0.5, 1, h] } : { scaleY: h * 0.4 }}
              transition={playing ? { duration: 0.8 + i * 0.1, repeat: Infinity, ease: "easeInOut", delay: i * 0.08 } : { duration: 0.3 }}
              style={{ height: "100%", originY: 1 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
