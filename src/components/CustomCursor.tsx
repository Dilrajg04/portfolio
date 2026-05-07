"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function CustomCursor() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState("");

  // Dot — near-instant
  const dotX = useSpring(x, { stiffness: 900, damping: 55 });
  const dotY = useSpring(y, { stiffness: 900, damping: 55 });

  // Ring — lazy trail
  const ringX = useSpring(x, { stiffness: 110, damping: 14 });
  const ringY = useSpring(y, { stiffness: 110, damping: 14 });

  const ringScale = useSpring(1, { stiffness: 280, damping: 24 });
  const dotScale  = useSpring(1, { stiffness: 280, damping: 24 });
  const ringOpacity = useSpring(0, { stiffness: 200, damping: 22 });

  useEffect(() => {
    function onMove(e: MouseEvent) { x.set(e.clientX); y.set(e.clientY); }
    function onEnterDoc() { ringOpacity.set(1); setVisible(true); }
    function onLeaveDoc() { ringOpacity.set(0); setVisible(false); }

    // Event delegation for interactive elements
    function onOver(e: MouseEvent) {
      const el = (e.target as Element).closest("a, button, [data-cursor]");
      if (!el) return;
      ringScale.set(2.4);
      dotScale.set(0);
      const tag = el.getAttribute("data-cursor") ?? "↗";
      setLabel(tag);
    }
    function onOut(e: MouseEvent) {
      const el = (e.target as Element).closest("a, button, [data-cursor]");
      if (!el) return;
      ringScale.set(1);
      dotScale.set(1);
      setLabel("");
    }

    // Click pulse
    function onClick() {
      ringScale.set(0.6);
      setTimeout(() => ringScale.set(1), 120);
    }

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseenter", onEnterDoc);
    document.addEventListener("mouseleave", onLeaveDoc);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);
    document.addEventListener("mousedown", onClick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseenter", onEnterDoc);
      document.removeEventListener("mouseleave", onLeaveDoc);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      document.removeEventListener("mousedown", onClick);
    };
  }, [x, y, ringScale, dotScale, ringOpacity]);

  return (
    <div className="hidden lg:block">
      {/* Outer ring — slow spin + trail + mix-blend */}
      <motion.div
        style={{ x: ringX, y: ringY, scale: ringScale, opacity: ringOpacity, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border border-dashed border-white flex items-center justify-center"
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.4 }}
                transition={{ duration: 0.15 }}
                className="text-white font-mono leading-none"
                style={{ fontSize: "9px" }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Inner dot — instant follow */}
      <motion.div
        style={{ x: dotX, y: dotY, scale: dotScale, translateX: "-50%", translateY: "-50%" }}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-white pointer-events-none z-[9999] mix-blend-difference"
      />
    </div>
  );
}
