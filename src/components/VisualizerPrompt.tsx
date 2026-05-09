"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";

export default function VisualizerPrompt() {
  const { playing, setVisualizerMode, visualizerMode } = useAudio();
  const [visible, setVisible] = useState(false);
  const shownRef = useRef(false);

  useEffect(() => {
    if (playing && !shownRef.current && !visualizerMode) {
      shownRef.current = true;
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
    if (!playing) setVisible(false);
  }, [playing, visualizerMode]);

  function accept() {
    setVisible(false);
    setTimeout(() => setVisualizerMode(true), 300);
  }

  function dismiss() {
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-4 right-4 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 sm:w-auto z-[100] flex items-center justify-between sm:justify-start gap-3 sm:gap-4 bg-[#0a0a0a] text-white rounded-2xl sm:rounded-full px-5 py-3.5 shadow-xl shadow-black/30"
        >
          <span className="text-sm font-display font-medium">
            Enter visualizer mode?
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={accept}
              className="text-sm font-display font-semibold bg-white text-black hover:bg-zinc-200 transition-colors px-4 py-1.5 rounded-full"
            >
              Yeah
            </button>
            <button
              onClick={dismiss}
              className="text-sm font-display font-medium text-zinc-400 hover:text-white transition-colors px-2 py-1.5"
            >
              Nah
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
