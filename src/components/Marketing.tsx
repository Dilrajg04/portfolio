"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const brands = [
  {
    name: "UCSD Arts & Humanities",
    type: "Content Strategy · Press",
    desc: "Pitch materials, interview briefs, and press content for the Dean's Office and notable alumni.",
  },
  {
    name: "Handshake",
    type: "UGC · Growth",
    desc: "Campus-facing content and growth campaigns as Growth Officer driving student platform adoption.",
  },
  {
    name: "Hawthorne",
    type: "UGC · Brand Content",
    desc: "User-generated content for brand campaigns, focused on authentic product storytelling.",
  },
  {
    name: "MathGPT",
    type: "UGC · EdTech",
    desc: "Content creation for an AI-powered math learning platform reaching student audiences.",
  },
  {
    name: "TEMU",
    type: "UGC · E-Commerce",
    desc: "Short-form video and social content for one of the fastest-growing e-commerce platforms.",
  },
];

/* ── Single brand row with proximity + hover animations ── */
function BrandRow({ brand, i }: { brand: typeof brands[0]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawProximity = useMotionValue(0); // 0 = far, 1 = close

  const x = useSpring(useTransform(rawX, [-300, 0, 300], [-3, 10, -3]), { stiffness: 200, damping: 25 });
  const dotScale = useSpring(useTransform(rawProximity, [0, 1], [1, 5]), { stiffness: 300, damping: 28 });
  const dotOpacity = useSpring(useTransform(rawProximity, [0, 1], [0.4, 1]), { stiffness: 300, damping: 28 });
  const nameWeight = useTransform(rawProximity, [0, 1], [600, 800]);
  const bgOpacity = useSpring(useTransform(rawProximity, [0, 0.6, 1], [0, 0, 1]), { stiffness: 300, damping: 30 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cy = r.top + r.height / 2;
      const cx = r.left + r.width / 2;
      const dy = e.clientY - cy;
      const dx = e.clientX - cx;
      const dist = Math.hypot(dx, dy);
      const proximity = Math.max(0, 1 - dist / 180);
      rawX.set(dx);
      rawProximity.set(proximity);
    }
    function onLeave() {
      rawX.set(0);
      rawProximity.set(0);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [rawX, rawProximity]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease, delay: i * 0.07 }}
      className="relative"
    >
      {/* Hover background highlight */}
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 -mx-4 rounded-xl pointer-events-none"
        aria-hidden
      >
        <div className="w-full h-full rounded-xl bg-gradient-to-r from-zinc-100/80 to-transparent" />
      </motion.div>

      <motion.div
        style={{ x }}
        className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 py-5 -mx-4 px-4 cursor-default"
      >
        {/* Bullet + name */}
        <div className="flex items-center gap-5 sm:w-64 shrink-0">
          <motion.span
            style={{ scaleX: dotScale, opacity: dotOpacity }}
            className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a] shrink-0 origin-left"
          />
          <motion.h3
            style={{ fontWeight: nameWeight }}
            className="font-display text-[#0a0a0a] text-base leading-snug"
          >
            {brand.name}
          </motion.h3>
        </div>

        <span className="text-xs font-mono text-zinc-400 bg-zinc-100 rounded-full px-3 py-1 self-start sm:self-auto shrink-0">
          {brand.type}
        </span>

        <p className="text-zinc-500 text-sm leading-relaxed flex-1">
          {brand.desc}
        </p>
      </motion.div>
    </motion.div>
  );
}

export default function Marketing() {
  return (
    <section id="marketing" className="px-6 lg:px-16 py-28">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs font-mono tracking-widest text-zinc-400 uppercase border border-zinc-200 rounded-full inline-flex px-4 py-1.5 mb-12"
      >
        Marketing & UGC
      </motion.p>

      {/* Heading + description */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
          className="font-display font-extrabold tracking-[-0.02em] leading-[1.05] text-[#0a0a0a]"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          Content that earns attention.<br />Strategy that converts.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease, delay: 0.1 }}
          className="text-zinc-500 text-sm leading-relaxed max-w-xs"
        >
          UGC content and brand growth strategy across tech, education, and consumer — from institutional press to viral short-form.
        </motion.p>
      </div>

      {/* Brand list */}
      <div className="divide-y divide-zinc-100">
        {brands.map((brand, i) => (
          <BrandRow key={brand.name} brand={brand} i={i} />
        ))}
      </div>
    </section>
  );
}
