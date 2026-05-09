"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "@/context/AudioContext";

export default function VisualizerCanvas() {
  const { analyser, visualizerMode, setVisualizerMode } = useAudio();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    document.documentElement.classList.toggle("visualizer-mode", visualizerMode);
    return () => { document.documentElement.classList.remove("visualizer-mode"); };
  }, [visualizerMode]);

  useEffect(() => {
    if (!visualizerMode || !analyser) {
      cancelAnimationFrame(frameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const data = new Uint8Array(analyser.frequencyBinCount);

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function draw() {
      if (!canvas || !ctx) return;
      analyser!.getByteFrequencyData(data);

      const w = canvas.width;
      const h = canvas.height;
      const bins = data.length;
      const barW = w / bins;

      ctx.clearRect(0, 0, w, h);

      const bass = data.slice(0, 6).reduce((a, b) => a + b, 0) / 6 / 255;

      // Red-orange edge vignette on bass hits
      if (bass > 0.22) {
        const grd = ctx.createRadialGradient(w / 2, h, 0, w / 2, h * 0.4, w * 0.9);
        grd.addColorStop(0, "transparent");
        grd.addColorStop(1, `rgba(220,60,0,${bass * 0.18})`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);
      }

      // Bars confined to bottom 16%
      const barAreaH = h * 0.16;

      // Soft fade above bars
      const fade = ctx.createLinearGradient(0, h - barAreaH * 1.6, 0, h - barAreaH);
      fade.addColorStop(0, "transparent");
      fade.addColorStop(1, "rgba(0,0,0,0.6)");
      ctx.fillStyle = fade;
      ctx.fillRect(0, h - barAreaH * 1.6, w, barAreaH * 1.6);

      for (let i = 0; i < bins; i++) {
        const val = data[i] / 255;
        const barH = val * barAreaH;
        const x = i * barW;

        // Orange at peak → red at base
        const barGrd = ctx.createLinearGradient(0, h - barH, 0, h);
        barGrd.addColorStop(0, `rgba(255,${100 + Math.floor(val * 80)},0,${0.6 + val * 0.4})`);
        barGrd.addColorStop(1, `rgba(180,10,0,${0.3 + val * 0.3})`);
        ctx.fillStyle = barGrd;
        ctx.fillRect(x, h - barH, barW - 1, barH);
      }

      // Thin orange line at top of bar area
      ctx.fillStyle = `rgba(255,120,0,${0.25 + bass * 0.55})`;
      ctx.fillRect(0, h - barAreaH - 1, w, 1);

      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [visualizerMode, analyser]);

  return (
    <AnimatePresence>
      {visualizerMode && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[-2] bg-black"
          />

          <motion.canvas
            ref={canvasRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-[-1] pointer-events-none"
          />

          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            onClick={() => setVisualizerMode(false)}
            className="fixed bottom-[19%] left-1/2 -translate-x-1/2 z-[200] text-[10px] sm:text-xs font-mono tracking-widest text-zinc-400 hover:text-white transition-colors uppercase border border-zinc-700 hover:border-zinc-400 rounded-full px-4 py-2 bg-black/70 whitespace-nowrap"
          >
            Exit Visualizer
          </motion.button>
        </>
      )}
    </AnimatePresence>
  );
}
