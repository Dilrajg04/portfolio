"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from "framer-motion";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const rawProgress = useMotionValue(0);
  const progress = useSpring(rawProgress, { stiffness: 80, damping: 20 });

  const size = 48;
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const strokeDashoffset = useTransform(progress, [0, 1], [circumference, 0]);

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      rawProgress.set(total > 0 ? scrolled / total : 0);
      setVisible(scrolled > 300);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [rawProgress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.7, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          className="fixed bottom-6 right-6 z-50 drop-shadow-sm"
          aria-label="Scroll to top"
        >
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
            {/* Background circle */}
            <circle cx={size / 2} cy={size / 2} r={r} fill="white" stroke="#e4e4e7" strokeWidth="1.5" />
            {/* Progress ring */}
            <motion.circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={circumference}
              style={{ strokeDashoffset, rotate: "-90deg", transformOrigin: `${size / 2}px ${size / 2}px` }}
            />
            {/* Arrow */}
            <path
              d={`M${size / 2} ${size / 2 + 5} L${size / 2} ${size / 2 - 5} M${size / 2 - 4} ${size / 2 - 1} L${size / 2} ${size / 2 - 5} L${size / 2 + 4} ${size / 2 - 1}`}
              stroke="#0a0a0a"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
