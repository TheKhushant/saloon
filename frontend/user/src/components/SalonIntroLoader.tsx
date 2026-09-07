import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors } from "lucide-react";

const SalonIntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"walk" | "approach" | "cut" | "reveal" | "logo" | "done">("walk");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("approach"), 700),
      setTimeout(() => setPhase("cut"), 1600),
      setTimeout(() => setPhase("reveal"), 2350),
      setTimeout(() => setPhase("logo"), 3000),
      setTimeout(() => setPhase("done"), 4200),
      setTimeout(() => onComplete(), 4800),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  // Hair gets trimmed into a neat style from the moment the scissors snip
  const isStyled = phase === "cut" || phase === "reveal" || phase === "logo";

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{ background: "linear-gradient(135deg, hsl(20 10% 8%), hsl(30 15% 12%), hsl(20 10% 8%))" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, hsl(38 70% 50% / 0.3), transparent 70%)" }}
            />
          </div>

          {/* Trim sparkle particles at the moment of the cut */}
          {phase === "cut" &&
            Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full"
                style={{ background: "hsl(38 80% 65%)" }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  x: (Math.random() - 0.5) * 100,
                  y: 50 + Math.random() * 90,
                  scale: [0, 1.4, 0],
                }}
                transition={{ duration: 0.8, delay: i * 0.04 }}
              />
            ))}

          {phase !== "logo" && (
            <div className="relative" style={{ width: 150, height: 190 }}>
              {/* The person - walks in from off-screen, then waits for their haircut */}
              <motion.div
                className="absolute inset-0"
                initial={{ x: -220, opacity: 0 }}
                animate={
                  phase === "walk"
                    ? { x: 0, opacity: 1, y: [0, -6, 0, -6, 0], rotate: [0, -2, 0, 2, 0] }
                    : { x: 0, opacity: 1, y: 0, rotate: 0 }
                }
                transition={
                  phase === "walk"
                    ? { duration: 0.7, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }
                    : { duration: 0.25, ease: "easeOut" }
                }
              >
                <svg width="150" height="190" viewBox="0 0 150 190" className="absolute inset-0">
                  {/* Shoulders / body */}
                  <path d="M20 190 Q20 120 75 120 Q130 120 130 190 Z" fill="hsl(30 12% 24%)" />
                  {/* Neck */}
                  <rect x="62" y="94" width="26" height="30" rx="8" fill="hsl(28 35% 62%)" />
                  {/* Head */}
                  <circle cx="75" cy="66" r="40" fill="hsl(28 38% 68%)" />
                  {/* Simple face hint */}
                  <circle cx="62" cy="68" r="2.5" fill="hsl(28 20% 30%)" />
                  <circle cx="88" cy="68" r="2.5" fill="hsl(28 20% 30%)" />
                  <path d="M64 84 Q75 90 86 84" stroke="hsl(28 20% 30%)" strokeWidth="2" fill="none" strokeLinecap="round" />
                </svg>

                {/* Hair - left lock, trims inward (shorter) once cut, doesn't disappear */}
                <div className="absolute" style={{ top: 8, left: 26 }}>
                  <motion.svg
                    width="55" height="46" viewBox="0 0 55 46"
                    style={{ transformOrigin: "100% 0%" }}
                    animate={
                      isStyled
                        ? { x: 12, y: 4, scale: 0.5, rotate: -6, opacity: 0 }
                        : { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <path d="M50 46 C6 46, 2 6, 50 2 L50 46 Z" fill="hsl(28 45% 24%)" />
                  </motion.svg>
                </div>

                {/* Hair - right lock, trims inward (shorter) once cut, doesn't disappear */}
                <div className="absolute" style={{ top: 8, left: 69 }}>
                  <motion.svg
                    width="55" height="46" viewBox="0 0 55 46"
                    style={{ transformOrigin: "0% 0%" }}
                    animate={
                      isStyled
                        ? { x: -12, y: 4, scale: 0.5, rotate: 6, opacity: 0 }
                        : { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }
                    }
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <path d="M5 46 C49 46, 53 6, 5 2 L5 46 Z" fill="hsl(28 45% 24%)" />
                  </motion.svg>
                </div>

                {/* Styled quiff haircut - fades in on top of the head once the trim is done */}
                <motion.svg
                  width="150" height="190" viewBox="0 0 150 190"
                  className="absolute inset-0 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={
                    isStyled
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.85 }
                  }
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  style={{ transformOrigin: "75px 40px" }}
                >
                  {/* Base volume, swept up and to the right into a neat quiff */}
                  <path
                    d="M32 62 Q26 18 65 10 Q80 7 95 16 Q120 26 115 62 Q118 38 90 28 Q75 24 60 29 Q36 34 32 62 Z"
                    fill="hsl(28 45% 24%)"
                  />
                  {/* Side part */}
                  <path
                    d="M52 27 Q58 20 68 17"
                    stroke="hsl(28 55% 34%)"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {/* Swept texture strands catching the light */}
                  <path d="M70 15 Q86 12 100 20" stroke="hsl(28 60% 38%)" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M66 20 Q83 18 99 26" stroke="hsl(28 55% 34%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  <path d="M64 26 Q80 25 96 32" stroke="hsl(28 50% 30%)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                </motion.svg>
              </motion.div>

              {/* Scissors - slide in from the left, snip the hair, then fade */}
              {(phase === "approach" || phase === "cut") && (
                <div className="absolute" style={{ top: 20, left: 10 }}>
                  <motion.div
                    initial={{ x: -190, opacity: 0, rotate: 15 }}
                    animate={
                      phase === "approach"
                        ? { x: 10, opacity: 1, rotate: 0 }
                        : { x: 10, opacity: 0, rotate: -20, scale: 0.85 }
                    }
                    transition={{
                      duration: phase === "approach" ? 0.9 : 0.5,
                      ease: "easeInOut",
                    }}
                  >
                    <motion.div
                      animate={phase === "cut" ? { rotate: [0, -18, 12, -14, 0] } : {}}
                      transition={{ duration: 0.6, times: [0, 0.3, 0.5, 0.7, 1], ease: "easeInOut" }}
                    >
                      <Scissors
                        className="drop-shadow-lg"
                        size={42}
                        color="hsl(38, 70%, 60%)"
                        strokeWidth={1.5}
                      />
                    </motion.div>
                  </motion.div>
                </div>
              )}
            </div>
          )}

          {/* Logo reveal */}
          {phase === "logo" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                className="w-24 h-24 rounded-full overflow-hidden drop-shadow-[0_0_25px_rgba(184,142,90,0.35)]"
                initial={{ rotate: -180 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <img
                  src="/logo.svg"
                  alt="Glam Aura logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.span
                className="text-3xl font-heading font-bold tracking-wide"
                style={{ color: "hsl(38 70% 65%)" }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Glam Aura
              </motion.span>
              <motion.div
                className="h-px w-24"
                style={{ background: "linear-gradient(90deg, transparent, hsl(38 70% 50%), transparent)" }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalonIntroLoader;
