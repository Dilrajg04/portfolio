"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/* ── 3D tilt wrapper ── */
function TiltCard({ children, className, innerClassName, delay = 0, href }: {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  href?: string;
}) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 });
  const scale = useSpring(1, { stiffness: 300, damping: 30 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
    scale.set(1.02);
  }
  function onLeave() { rawX.set(0); rawY.set(0); scale.set(1); }

  const inner = (
    <motion.div
      style={{ rotateX, rotateY, scale, transformPerspective: 900 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`h-full rounded-2xl p-8 flex flex-col gap-4 ${href ? "cursor-pointer" : "cursor-default"} ${innerClassName ?? "border border-zinc-200 bg-white"}`}
    >
      {children}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease, delay }}
      className={`h-full ${className ?? ""}`}
    >
      {href ? <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">{inner}</a> : inner}
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="px-6 lg:px-16 py-28 bg-zinc-50/50">
      {/* Label */}
      <div className="mb-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono tracking-widest text-zinc-400 uppercase border border-zinc-200 rounded-full inline-flex px-4 py-1.5 mb-6 bg-white"
        >
          Projects
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease }}
          className="font-display font-extrabold tracking-[-0.03em] text-[#0a0a0a]"
          style={{ fontSize: "clamp(2.25rem, 5vw, 4.5rem)" }}
        >
          Things I&apos;ve built.
        </motion.h2>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:grid-rows-[minmax(320px,auto)_minmax(260px,auto)]">

        {/* LARPER — large, top-left, 2 cols */}
        <motion.a
          href="https://larper.co"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          whileHover={{ scale: 1.01 }}
          className="group lg:col-span-2 rounded-3xl overflow-hidden bg-[#0a0a0a] text-white relative flex flex-col justify-between p-10 lg:p-12 min-h-[320px]"
        >
          <motion.div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            initial={{ opacity: 0.1 }}
            whileHover={{ opacity: 0.2, scale: 1.15 }}
            transition={{ duration: 0.5 }}
            style={{ background: "radial-gradient(circle, #10b981, transparent 70%)", transform: "translate(30%, -30%)" }}
          />
          <div className="relative z-10">
            <div className="flex items-start justify-between gap-4 mb-6">
              <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">Featured Project</span>
              <motion.span
                className="text-2xl text-zinc-600"
                whileHover={{ x: 3, y: -3, color: "#ffffff" }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                aria-hidden
              >
                ↗
              </motion.span>
            </div>
            <h3
              className="font-display font-extrabold tracking-[-0.03em] leading-none text-white mb-4"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
            >
              LARPER
            </h3>
            <p className="text-zinc-400 max-w-lg leading-relaxed text-sm">
              A free weekly AI and tech newsletter built entirely from scratch — for students, by a student. Custom Next.js site, Resend subscriber management, automated news curation, Stripe donations, and an admin panel.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-2 mt-8">
            {["Next.js", "Resend", "Stripe", "TypeScript", "Guardian API"].map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ borderColor: "#10b981", color: "#6ee7b7" }}
                transition={{ duration: 0.15 }}
                className="text-xs font-mono px-3 py-1.5 rounded-full border border-zinc-700 text-zinc-400"
              >
                {tag}
              </motion.span>
            ))}
            <span className="ml-auto text-sm font-mono text-zinc-500 group-hover:text-emerald-400 transition-colors duration-200 self-center">
              larper.co ↗
            </span>
          </div>
        </motion.a>

        {/* DS3 CLARIFY — top-right, 1 col */}
        <TiltCard delay={0.08}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Research</span>
            <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-500">
              In Progress
            </span>
          </div>
          <h3 className="font-display font-bold text-[#0a0a0a] text-xl leading-snug">
            DS3 CLARIFY
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed flex-1">
            Data Science Student Society analytics project at UCSD — research, data pipelines, and insights.
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {["Python", "pandas", "sklearn"].map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-mono px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-400"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </TiltCard>

        {/* F1 Simulator — bottom-left, 1 col, links to GitHub */}
        <TiltCard delay={0.14} href="https://github.com/Dilrajg04/f1-pit-strategy-simulator">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Data Science</span>
            <span className="text-xs font-mono text-zinc-400 flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub ↗
            </span>
          </div>
          <h3 className="font-display font-bold text-[#0a0a0a] text-xl leading-snug">
            F1 Pit Stop Strategy Simulator
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed flex-1">
            Uses F1 race data to model tire degradation and simulate optimal pit stop timing. Counterfactual simulations minimize total race time.
          </p>
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-wrap gap-2">
              {["Python", "Simulation", "Data Analytics"].map((tag) => (
                <motion.span
                  key={tag}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-mono px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-400"
                >
                  {tag}
                </motion.span>
              ))}
            </div>
            <span className="text-xs font-mono text-zinc-300 shrink-0 ml-3">Dec '25</span>
          </div>
        </TiltCard>

        {/* Power Outage — bottom-middle, 1 col */}
        <TiltCard delay={0.2} href="https://dilrajg04.github.io/power-outage-analysis/">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono tracking-widest text-zinc-400 uppercase">Data Science</span>
            <span className="text-xs font-mono text-zinc-400">View ↗</span>
          </div>
          <h3 className="font-display font-bold text-[#0a0a0a] text-xl leading-snug">
            US Power Outage Analysis
          </h3>
          <p className="text-zinc-500 text-sm leading-relaxed flex-1">
            Explores power outage patterns across the United States to discover factors affecting outage duration — with predictive models built on Scikit-Learn.
          </p>
          <div className="flex flex-wrap gap-2 mt-auto">
            {["Scikit-Learn", "Hypothesis Testing", "Python", "EDA"].map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.15 }}
                className="text-xs font-mono px-2.5 py-1 rounded-full border border-zinc-200 text-zinc-400"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </TiltCard>

        {/* Mustang App — bottom-right corner, 1 col, dark */}
        <TiltCard delay={0.26} innerClassName="bg-[#0a0a0a] text-white relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-[300px] h-[300px] rounded-full pointer-events-none opacity-10"
            style={{ background: "radial-gradient(circle, #818cf8, transparent 70%)", transform: "translate(30%, -30%)" }}
          />
          <div className="relative z-10 flex items-start justify-between gap-3">
            <span className="text-xs font-mono tracking-widest text-indigo-400 uppercase">Product</span>
            <span className="text-xs font-mono bg-white/10 text-white/50 rounded-full px-2.5 py-1 shrink-0">Case Study</span>
          </div>
          <h3 className="relative z-10 font-display font-bold text-white text-xl leading-snug">
            The Mustang App
          </h3>
          <p className="relative z-10 text-white/60 text-sm leading-relaxed flex-1">
            Stakeholder feedback collection, feature prioritization, and representing the company perspective throughout the product lifecycle.
          </p>
          <div className="relative z-10 flex flex-wrap gap-2 mt-auto">
            {["Feature Prioritization", "Roadmapping", "PM"].map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ borderColor: "#818cf8", color: "#a5b4fc" }}
                transition={{ duration: 0.15 }}
                className="text-xs font-mono px-2.5 py-1.5 rounded-full border border-zinc-700 text-zinc-500"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </TiltCard>

      </div>
    </section>
  );
}
