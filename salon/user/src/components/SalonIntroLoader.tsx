import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scissors } from "lucide-react";

const SalonIntroLoader = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"hair" | "cut" | "split" | "logo" | "done">("hair");

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase("cut"), 600),
      setTimeout(() => setPhase("split"), 1800),
      setTimeout(() => setPhase("logo"), 2400),
      setTimeout(() => setPhase("done"), 3600),
      setTimeout(() => onComplete(), 4200),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
              style={{ background: "radial-gradient(circle, hsl(38 70% 50% / 0.3), transparent 70%)" }} />
          </div>

          {/* Sparkle particles */}
          {phase === "split" && Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{ background: "hsl(38 80% 65%)" }}
              initial={{ opacity: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 0],
                x: (Math.random() - 0.5) * 120,
                y: (Math.random() - 0.5) * 120,
                scale: [0, 1.5, 0],
              }}
              transition={{ duration: 0.8, delay: i * 0.05 }}
            />
          ))}

          {/* Hair strand */}
          <div className="relative flex items-center justify-center">
            {phase !== "logo" && (
              <>
                {/* Left half of hair */}
                <motion.div
                  className="absolute"
                  animate={
                    phase === "split"
                      ? { x: -40, y: 80, rotate: -25, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={
                    phase === "split"
                      ? { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
                      : { duration: 0.5 }
                  }
                >
                  <svg width="6" height="120" viewBox="0 0 6 120">
                    <path
                      d="M3 0 C3 20, 1 40, 3 60"
                      stroke="hsl(38, 60%, 45%)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 0 C3 20, 1 40, 3 60"
                      stroke="hsl(38, 70%, 55%)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </svg>
                </motion.div>

                {/* Right half of hair */}
                <motion.div
                  className="absolute"
                  animate={
                    phase === "split"
                      ? { x: 40, y: 80, rotate: 25, opacity: 0 }
                      : { x: 0, y: 0, rotate: 0, opacity: 1 }
                  }
                  transition={
                    phase === "split"
                      ? { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }
                      : { duration: 0.5 }
                  }
                >
                  <svg width="6" height="120" viewBox="0 0 6 120">
                    <path
                      d="M3 60 C5 80, 3 100, 3 120"
                      stroke="hsl(38, 60%, 45%)"
                      strokeWidth="4"
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path
                      d="M3 60 C5 80, 3 100, 3 120"
                      stroke="hsl(38, 70%, 55%)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                      opacity="0.6"
                    />
                  </svg>
                </motion.div>
              </>
            )}

            {/* Scissors */}
            {(phase === "hair" || phase === "cut" || phase === "split") && (
              <motion.div
                className="absolute"
                initial={{ x: 120, opacity: 0, rotate: -30 }}
                animate={
                  phase === "cut"
                    ? { x: 8, opacity: 1, rotate: 0 }
                    : phase === "split"
                    ? { x: 8, opacity: 0, rotate: 15, scale: 0.8 }
                    : { x: 120, opacity: 0, rotate: -30 }
                }
                transition={{
                  duration: phase === "cut" ? 1.0 : 0.4,
                  ease: "easeInOut",
                }}
              >
                {/* Scissors cutting animation */}
                <motion.div
                  animate={
                    phase === "cut"
                      ? { rotate: [0, 15, -5, 10, 0] }
                      : {}
                  }
                  transition={{
                    duration: 1.0,
                    times: [0, 0.3, 0.5, 0.7, 1],
                    ease: "easeInOut",
                  }}
                >
                  <Scissors
                    className="drop-shadow-lg"
                    size={48}
                    color="hsl(38, 70%, 60%)"
                    strokeWidth={1.5}
                  />
                </motion.div>
              </motion.div>
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
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, hsl(38 70% 50%), hsl(30 60% 40%))" }}
                  initial={{ rotate: -180 }}
                  animate={{ rotate: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <Scissors className="w-8 h-8 text-white" />
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SalonIntroLoader;
