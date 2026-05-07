"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useIsMobile } from "@/hooks/useIsMobile";

const ease = [0.22, 1, 0.36, 1] as const;

const artworks: { src: string; alt: string; col: string; pos?: string }[] = [
  { src: "/artwork/piece-1.jpeg", alt: "Geometric voxel figure — Blender",            col: "lg:col-span-1" },
  { src: "/artwork/piece-2.jpeg", alt: "Isometric futuristic city — Blender",          col: "lg:col-span-2" },
  { src: "/artwork/piece-4.jpeg", alt: "Organic fractal cave formations — Blender",    col: "lg:col-span-2" },
  { src: "/artwork/piece-3.jpeg", alt: "Chrome fragmented skull in profile — Blender", col: "lg:col-span-1" },
];

/* ── Desktop: mouse tilt + float ── */
function DesktopTiltCard({ children, wrapperClass, delay = 0, floatDuration = 3.5, floatDelay = 0 }: {
  children: React.ReactNode; wrapperClass: string; delay?: number; floatDuration?: number; floatDelay?: number;
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
  function onLeave() { rawX.set(0); rawY.set(0); }

  return (
    <motion.div className={wrapperClass} initial={{ opacity: 0, y: 40, scale: 0.93 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.75, ease, delay }}>
      <motion.div className="w-full h-full" style={{ rotateX, rotateY, transformPerspective: 900 }} onMouseMove={onMove} onMouseLeave={onLeave}>
        <motion.div className="w-full h-full" animate={{ y: [0, -8, 0] }} transition={{ duration: floatDuration, repeat: Infinity, ease: "easeInOut", delay: floatDelay }}>
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Mobile: gyroscope tilt (shared values passed in) ── */
function MobileTiltCard({ children, wrapperClass, delay = 0, rotateX, rotateY }: {
  children: React.ReactNode; wrapperClass: string; delay?: number;
  rotateX: ReturnType<typeof useSpring>; rotateY: ReturnType<typeof useSpring>;
}) {
  return (
    <motion.div
      className={wrapperClass}
      initial={{ opacity: 0, y: 30, scale: 0.93 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, ease, delay }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div className="w-full h-full" style={{ rotateX, rotateY, transformPerspective: 900 }}>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ── Word-by-word slide-up reveal ── */
function WordReveal({ text, className, delayChildren = 0 }: { text: string; className?: string; delayChildren?: number }) {
  return (
    <motion.span className={`inline ${className ?? ""}`} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }} variants={{ show: { transition: { staggerChildren: 0.07, delayChildren } } }}>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.28em] last:mr-0">
          <motion.span className="inline-block" variants={{ hidden: { y: "110%", opacity: 0 }, show: { y: 0, opacity: 1, transition: { duration: 0.65, ease } } }}>
            {word}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

export default function Artwork() {
  const isMobile = useIsMobile();

  // Shared gyroscope values for all mobile cards
  const gyroX = useMotionValue(0);
  const gyroY = useMotionValue(0);
  const rotateX = useSpring(gyroX, { stiffness: 60, damping: 20 });
  const rotateY = useSpring(gyroY, { stiffness: 60, damping: 20 });

  const [gyroState, setGyroState] = useState<"idle" | "granted" | "denied">("idle");

  function requestGyro() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const DOE = DeviceOrientationEvent as any;
    if (typeof DOE.requestPermission === "function") {
      DOE.requestPermission().then((res: string) => {
        if (res === "granted") setGyroState("granted");
        else setGyroState("denied");
      });
    } else {
      setGyroState("granted");
    }
  }

  useEffect(() => {
    if (!isMobile || gyroState !== "granted") return;
    function onOrientation(e: DeviceOrientationEvent) {
      const gamma = e.gamma ?? 0; // left-right: -90 to 90
      const beta  = e.beta  ?? 0; // front-back: -180 to 180
      gyroY.set(gamma * 0.18);
      gyroX.set((beta - 45) * 0.12); // 45° = typical phone hold angle
    }
    window.addEventListener("deviceorientation", onOrientation);
    return () => window.removeEventListener("deviceorientation", onOrientation);
  }, [isMobile, gyroState, gyroX, gyroY]);

  return (
    <section id="artwork" className="bg-[#0a0a0a] px-6 lg:px-16 py-28">
      <motion.p initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="text-xs font-mono tracking-widest text-zinc-500 uppercase border border-zinc-800 rounded-full inline-flex px-4 py-1.5 mb-12">
        3D Artwork
      </motion.p>

      <div className="mb-14">
        <h2 className="font-display font-extrabold tracking-[-0.02em] leading-[1.05] text-white" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
          <WordReveal text="Worlds built from scratch." />
        </h2>
        <motion.p initial={{ opacity: 0, filter: "blur(14px)" }} whileInView={{ opacity: 1, filter: "blur(0px)" }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 1.0, ease, delay: 0.55 }} className="font-display font-extrabold tracking-[-0.02em] leading-[1.05] text-zinc-600 mt-1" style={{ fontSize: "clamp(2rem, 4vw, 3.25rem)" }}>
          Before AI.
        </motion.p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <motion.div initial={{ opacity: 0, scale: 0.6, y: 10 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease: [0.34, 1.56, 0.64, 1], delay: 0.85 }} className="inline-flex items-center gap-2.5 border border-zinc-700 hover:border-zinc-500 rounded-full px-4 py-2 transition-colors duration-300 cursor-default">
            <span className="w-2 h-2 rounded-full bg-[#EA7600] shrink-0" />
            <span className="text-xs font-mono text-zinc-400 tracking-wide">Made in Blender</span>
          </motion.div>

          {/* Gyro button — mobile only */}
          {isMobile && gyroState === "idle" && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
              onClick={requestGyro}
              className="inline-flex items-center gap-2 border border-zinc-600 rounded-full px-4 py-2 text-xs font-mono text-zinc-400 active:scale-95 transition-transform"
            >
              <span className="text-base">⟳</span> Enable Tilt
            </motion.button>
          )}
          {isMobile && gyroState === "granted" && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-mono text-zinc-600">
              tilt your phone ↗
            </motion.p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {artworks.map((art, i) =>
          isMobile ? (
            <MobileTiltCard
              key={art.src}
              wrapperClass={`relative overflow-hidden rounded-2xl bg-zinc-900 h-[280px] lg:h-[420px] ${art.col}`}
              delay={i * 0.09}
              rotateX={rotateX}
              rotateY={rotateY}
            >
              <Image src={art.src} alt={art.alt} fill className={`object-cover ${art.pos ?? "object-center"}`} sizes="100vw" />
            </MobileTiltCard>
          ) : (
            <DesktopTiltCard
              key={art.src}
              wrapperClass={`relative overflow-hidden rounded-2xl bg-zinc-900 h-[280px] lg:h-[420px] ${art.col}`}
              delay={i * 0.09}
              floatDuration={3.5 + i * 0.4}
              floatDelay={i * 0.5}
            >
              <Image src={art.src} alt={art.alt} fill className={`object-cover ${art.pos ?? "object-center"}`} sizes="(max-width: 1024px) 100vw, 50vw" />
            </DesktopTiltCard>
          )
        )}
      </div>

      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="text-xs font-mono text-zinc-700 mt-8">
        {`${artworks.length} pieces · Made in Blender`}
      </motion.p>
    </section>
  );
}
