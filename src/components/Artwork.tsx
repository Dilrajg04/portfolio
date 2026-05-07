"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

const ease = [0.22, 1, 0.36, 1] as const;

// Row 1: portrait (1 col) | wide city (2 col)
// Row 2: wide fractal (2 col) | portrait skull (1 col)
const artworks: { src: string; alt: string; col: string; pos?: string }[] = [
  { src: "/artwork/piece-1.jpeg", alt: "Geometric voxel figure — Blender",             col: "lg:col-span-1" },
  { src: "/artwork/piece-2.jpeg", alt: "Isometric futuristic city — Blender",           col: "lg:col-span-2" },
  { src: "/artwork/piece-4.jpeg", alt: "Organic fractal cave formations — Blender",     col: "lg:col-span-2" },
  { src: "/artwork/piece-3.jpeg", alt: "Chrome fragmented skull in profile — Blender",  col: "lg:col-span-1" },
];

/* ── 3D tilt + float wrapper ── */
function TiltCard({
  children,
  wrapperClass,
  delay = 0,
  floatDuration = 3.5,
  floatDelay = 0,
}: {
  children: React.ReactNode;
  wrapperClass: string;
  delay?: number;
  floatDuration?: number;
  floatDelay?: number;
}) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [12, -12]), { stiffness: 250, damping: 28 });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-12, 12]), { stiffness: 250, damping: 28 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    /* entrance */
    <motion.div
      className={wrapperClass}
      initial={{ opacity: 0, y: 40, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, ease, delay }}
    >
      {/* tilt */}
      <motion.div
        className="w-full h-full"
        style={{ rotateX, rotateY, transformPerspective: 900 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {/* float */}
        <motion.div
          className="w-full h-full"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Word-by-word slide-up reveal ── */
function WordReveal({
  text,
  className,
  delayChildren = 0,
}: {
  text: string;
  className?: string;
  delayChildren?: number;
}) {
  return (
    <motion.span
      className={`inline ${className ?? ""}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ show: { transition: { staggerChildren: 0.07, delayChildren } } }}
    >
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.28em] last:mr-0">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: { y: 0, opacity: 1, transition: { duration: 0.65, ease } },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export default function Artwork() {
  return (
    <section id="artwork" className="bg-[#0a0a0a] px-6 lg:px-16 py-28">
      {/* Label */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-xs font-mono tracking-widest text-zinc-500 uppercase border border-zinc-800 rounded-full inline-flex px-4 py-1.5 mb-12"
      >
        3D Artwork
      </motion.p>

      {/* Heading block */}
      <div className="mb-14">
        {/* "Worlds built from scratch." — word reveal */}
        <h2
          className="font-display font-extrabold tracking-[-0.02em] leading-[1.05] text-white"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          <WordReveal text="Worlds built from scratch." />
        </h2>

        {/* "Before AI." — blurs in after a delay */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(14px)" }}
          whileInView={{ opacity: 1, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 1.0, ease, delay: 0.55 }}
          className="font-display font-extrabold tracking-[-0.02em] leading-[1.05] text-zinc-600 mt-1"
          style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}
        >
          Before AI.
        </motion.p>

        {/* Blender pill — spring bounce */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.85 }}
          className="mt-7 inline-flex items-center gap-2.5 border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors duration-300 cursor-default"
        >
          <span className="w-2 h-2 rounded-full bg-[#EA7600] shrink-0" />
          <span className="text-xs font-mono text-zinc-400 tracking-wide">Made in Blender</span>
        </motion.div>
      </div>

      {/* Grid — mirror layout: [portrait | wide] / [wide | portrait] */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {artworks.map((art, i) => (
          <TiltCard
            key={art.src}
            wrapperClass={`relative overflow-hidden rounded-2xl bg-zinc-900 h-[280px] lg:h-[420px] ${art.col}`}
            delay={i * 0.09}
            floatDuration={3.5 + i * 0.4}
            floatDelay={i * 0.5}
          >
            <Image
              src={art.src}
              alt={art.alt}
              fill
              className={`object-cover ${art.pos ?? "object-center"}`}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </TiltCard>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-xs font-mono text-zinc-700 mt-8"
      >
        {`${artworks.length} pieces · Made in Blender`}
      </motion.p>
    </section>
  );
}
