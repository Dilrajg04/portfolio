"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

const work = [
  {
    num: "01",
    role: "Business Intelligence Developer",
    org: "Victory Capital",
    period: "Summer 2026",
    location: "San Antonio, TX",
    type: "Internship",
    desc: "ETFs, mutual funds, and investment analytics within asset management. NAV, AUM, alpha/beta, expense ratios.",
    glow: "#7dd3fc",
  },
  {
    num: "02",
    role: "Growth Officer",
    org: "Startup Incubator @ UCSD",
    period: "2025 – Present",
    location: "La Jolla, CA",
    type: "Leadership",
    desc: "Organized LaunchPoint (40+ clubs), a YC-backed hackathon, and Project Liftoff student recruitment week.",
    glow: "#f59e0b",
  },
  {
    num: "03",
    role: "Public Relations Analyst",
    org: "UCSD School of Arts & Humanities",
    period: "2025 – Present",
    location: "La Jolla, CA",
    type: "Internship",
    desc: "Press content and pitch materials for alumni including Sev Ohanian (Sinners) and Marge Dean (Invincible).",
    glow: "#3b82f6",
  },
  {
    num: "04",
    role: "Campus Ambassador",
    org: "Handshake",
    period: "2024 – Present",
    location: "Remote",
    type: "Ambassador",
    desc: "UGC content, campus outreach, and brand representation for the leading student career platform.",
    glow: "#86efac",
  },
];

const cardVariant = {
  hidden: { opacity: 0, y: 40, scale: 0.97, filter: "blur(4px)" },
  show: {
    opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
    transition: { duration: 0.65, ease, staggerChildren: 0.08, delayChildren: 0.15 },
  },
};
const childVariant = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

interface Ripple { id: number; x: number; y: number }

/* ── Per-card with ripple + tilt ── */
function WorkCard({ item, i }: { item: typeof work[0]; i: number }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [active, setActive] = useState(false);
  const lastRipple = useRef(0);

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(rawY, [0, 1], [6, -6]), { stiffness: 200, damping: 26 });
  const rotateY = useSpring(useTransform(rawX, [0, 1], [-6, 6]), { stiffness: 200, damping: 26 });
  const cardScale = useSpring(1, { stiffness: 280, damping: 28 });

  // Direct springs — jump() on enter so there's no travel from off-screen
  const followerX = useSpring(-200, { stiffness: 180, damping: 18 });
  const followerY = useSpring(-200, { stiffness: 180, damping: 18 });
  const followerOpacity = useSpring(0, { stiffness: 200, damping: 22 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    rawX.set(x / r.width);
    rawY.set(y / r.height);
    followerX.set(x - 14);
    followerY.set(y - 14);

    // Throttled ripple emission
    const now = Date.now();
    if (now - lastRipple.current > 140) {
      lastRipple.current = now;
      const id = now;
      setRipples(prev => [...prev.slice(-8), { id, x, y }]);
      setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 900);
    }
  }

  function onEnter(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    // Snap immediately to entry position — no spring travel from off-screen
    followerX.jump(e.clientX - r.left - 14);
    followerY.jump(e.clientY - r.top - 14);
    setActive(true);
    cardScale.set(1.02);
    followerOpacity.set(1);
  }
  function onLeave() {
    setActive(false);
    rawX.set(0.5); rawY.set(0.5);
    cardScale.set(1);
    followerOpacity.set(0);
    setRipples([]);
  }

  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: i * 0.1 }}
      style={{ transformPerspective: 900 }}
    >
      <motion.div
        style={{ rotateX, rotateY, scale: cardScale }}
        onMouseMove={onMove}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        className="relative rounded-2xl bg-[#0a0a0a] p-8 flex flex-col gap-5 overflow-hidden cursor-none"
      >
        {/* Ripple rings */}
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            initial={{ scale: 0.1, opacity: 0.65 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
            style={{
              position: "absolute",
              left: ripple.x - 60,
              top: ripple.y - 60,
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: `1.5px solid ${item.glow}`,
              pointerEvents: "none",
              zIndex: 10,
            }}
          />
        ))}

        {/* Cursor follower ring */}
        <motion.div
          style={{
            x: followerX,
            y: followerY,
            opacity: followerOpacity,
            border: `1.5px solid ${item.glow}`,
          }}
          className="absolute top-0 left-0 w-7 h-7 rounded-full pointer-events-none z-20"
        />

        {/* Content */}
        <motion.div variants={childVariant} className="relative z-10 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase" style={{ color: item.glow }}>{item.org}</p>
            <p className="text-xs font-mono text-white/40 mt-0.5">{item.location}</p>
          </div>
          <span className="text-[10px] font-mono rounded-full px-2.5 py-1 shrink-0" style={{ color: item.glow, background: `${item.glow}18` }}>
            {item.type}
          </span>
        </motion.div>

        <motion.h3 variants={childVariant} className="relative z-10 font-display font-semibold text-white text-lg leading-snug">
          {item.role}
        </motion.h3>

        <motion.p variants={childVariant} className="relative z-10 text-white/60 text-sm leading-relaxed flex-1">
          {item.desc}
        </motion.p>

        <motion.div variants={childVariant} className="relative z-10 flex items-center justify-between pt-2 border-t border-white/10">
          <span className="font-mono text-[10px] text-white/30">{item.num}</span>
          <span className="text-xs font-mono text-white/50">{item.period}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Work() {
  return (
    <section id="work" className="px-6 lg:px-16 py-28">
      <div className="mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-widest text-zinc-400 uppercase border border-zinc-200 rounded-full inline-flex px-4 py-1.5 mb-6"
        >
          Experience
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease }}
          className="font-display font-extrabold tracking-[-0.03em] text-[#0a0a0a]"
          style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
        >
          Where I&apos;ve worked.
        </motion.h2>
      </div>

      <div className="flex flex-col gap-4">
        {work.map((item, i) => (
          <WorkCard key={item.num} item={item} i={i} />
        ))}
      </div>
    </section>
  );
}
