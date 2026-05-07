"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── Smooth count-up on scroll ── */
function useCountUp(target: number, decimals = 0, duration = 1500) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = parseFloat((eased * target).toFixed(decimals));
      setCount(current);
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    }
    requestAnimationFrame(tick);
  }, [inView, target, decimals, duration]);

  return { count, ref };
}

/* ── Big animated number ── */
function StatNumber({
  value,
  unit,
  decimals = 0,
  numberClass = "text-[#0a0a0a]",
  unitClass = "text-zinc-300",
}: {
  value: number;
  unit: string;
  decimals?: number;
  numberClass?: string;
  unitClass?: string;
}) {
  const { count, ref } = useCountUp(value, decimals);
  return (
    <div className="flex items-end gap-1.5 leading-none">
      <span
        ref={ref}
        className={`font-display font-extrabold tracking-[-0.04em] tabular-nums ${numberClass}`}
        style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)" }}
      >
        {decimals > 0 ? count.toFixed(decimals) : count}
      </span>
      <span
        className={`font-display font-bold pb-2 ${unitClass}`}
        style={{ fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)" }}
      >
        {unit}
      </span>
    </div>
  );
}

/* ── Bar chart decoration ── */
const bars = [2, 3, 2, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 11, 13];

function MiniChart() {
  return (
    <div>
      <div className="flex items-end gap-[3px] h-14">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: 0.3 + i * 0.04, ease }}
            style={{ height: `${h * 4}px`, transformOrigin: "bottom" }}
            className="flex-1 rounded-[2px] bg-indigo-400 opacity-40 hover:opacity-70 transition-opacity duration-150"
          />
        ))}
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-mono text-indigo-300">
        <span>Jan &apos;23</span>
        <span>Now</span>
      </div>
    </div>
  );
}

/* ── Section ── */
export default function Stats() {
  return (
    <section id="stats" className="px-6 lg:px-16 py-28">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65, ease }}
        className="font-display font-extrabold tracking-[-0.03em] text-[#0a0a0a] mb-12"
        style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
      >
        Views, by the numbers.
      </motion.h2>

      {/* Card grid — left hero + right 2×2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:[grid-template-rows:1fr_1fr]">

        {/* ── 4.7M — hero card, indigo ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease }}
          className="lg:row-span-2 rounded-2xl bg-indigo-600 p-8 flex flex-col justify-between gap-8 min-h-[300px]"
        >
          <div>
            <p className="text-[10px] font-mono tracking-widest text-indigo-300 uppercase mb-1.5">
              Likes · All Platforms
            </p>
            <p className="text-sm text-indigo-200/70">Across TikTok &amp; Instagram</p>
          </div>
          <StatNumber value={5.1} unit="M" decimals={1} numberClass="text-white" unitClass="text-indigo-300" />
          <MiniChart />
        </motion.div>

        {/* ── 33.7K TikTok followers — rose ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease, delay: 0.07 }}
          className="rounded-2xl bg-rose-50 border border-rose-100 p-7 flex flex-col gap-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-rose-400 uppercase">TikTok</p>
              <p className="text-xs font-mono text-rose-300 mt-1">@dilnextdoor_</p>
            </div>
            <span className="text-[10px] font-mono bg-rose-100 text-rose-400 rounded-full px-2.5 py-1 shrink-0 flex items-center gap-1">
              ▲ Growing
            </span>
          </div>
          <StatNumber value={33.7} unit="K" decimals={1} numberClass="text-rose-600" unitClass="text-rose-300" />
          <p className="text-sm text-rose-300">followers</p>
        </motion.div>

        {/* ── 26K Instagram followers — violet ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease, delay: 0.12 }}
          className="rounded-2xl bg-violet-50 border border-violet-100 p-7 flex flex-col gap-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-violet-400 uppercase">Instagram</p>
              <p className="text-xs font-mono text-violet-300 mt-1">@dilnextdoor</p>
            </div>
            <span className="text-[10px] font-mono bg-violet-100 text-violet-400 rounded-full px-2.5 py-1 shrink-0">
              Building
            </span>
          </div>
          <StatNumber value={26} unit="K" numberClass="text-violet-600" unitClass="text-violet-300" />
          <p className="text-sm text-violet-300">followers</p>
        </motion.div>

        {/* ── 200K+ brand views — dark ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease, delay: 0.17 }}
          className="rounded-2xl bg-[#0a0a0a] p-7 flex flex-col gap-5"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase">Brand Views</p>
              <p className="text-sm text-white/40 mt-1">For partner campaigns</p>
            </div>
            <span className="text-[10px] font-mono bg-white/10 text-white/40 rounded-full px-2.5 py-1 shrink-0">
              ✦ Brand
            </span>
          </div>
          <StatNumber value={200} unit="K+" numberClass="text-white" unitClass="text-white/30" />
          <p className="text-sm text-white/30">delivered to brands</p>
        </motion.div>

        {/* ── 48% LARPER open rate — emerald ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.65, ease, delay: 0.22 }}
          className="rounded-2xl bg-emerald-50 border border-emerald-100 p-7 flex flex-col gap-5"
        >
          <div>
            <p className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase">
              Open Rate · LARPER
            </p>
            <p className="text-sm text-emerald-400/70 mt-1">vs. industry avg 21%</p>
          </div>
          <StatNumber value={48} unit="%" numberClass="text-emerald-600" unitClass="text-emerald-300" />
          <p className="text-sm text-emerald-400/70">avg across all issues</p>
        </motion.div>

      </div>
    </section>
  );
}
