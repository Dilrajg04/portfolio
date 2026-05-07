"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export default function About() {
  return (
    <section id="about" className="px-6 lg:px-16 py-28">
      {/* Label */}
      <motion.p
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={fadeUp}
        className="text-xs font-mono tracking-widest text-zinc-400 uppercase mb-12 border border-zinc-200 rounded-full inline-flex px-4 py-1.5"
      >
        About Me
      </motion.p>

      <div className="flex flex-col lg:flex-row lg:gap-24 gap-10">
        {/* Left — big statement */}
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={fadeUp}
          className="font-display font-extrabold leading-[1.05] tracking-[-0.02em] text-[#0a0a0a] lg:w-3/5"
          style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}
        >
          I study data to understand systems. I build to change them. I tell stories to make both matter.
        </motion.h2>

        {/* Right — description */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ ...fadeUp, show: { ...fadeUp.show, transition: { duration: 0.7, ease, delay: 0.15 } } }}
          className="lg:w-2/5 flex flex-col justify-end"
        >
          <p className="text-zinc-500 leading-relaxed text-base">
            Data science student at UC San Diego with a focus on machine learning, statistical analysis, and business intelligence. Interning at Victory Capital in asset management analytics. Founder of LARPER, a free weekly AI newsletter. Events lead at the UCSD Startup Incubator.
          </p>
          <p className="text-zinc-400 leading-relaxed text-base mt-4">
            I follow startup and VC ecosystems closely — particularly where AI meets investment. I care about the places where numbers become decisions, and decisions become narratives.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Python", "SQL", "pandas", "sklearn", "R", "Next.js", "Tailwind", "Git"].map((skill) => (
              <span
                key={skill}
                className="text-xs font-mono px-3 py-1 rounded-full border border-zinc-200 text-zinc-500 bg-zinc-50"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
