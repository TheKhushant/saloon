import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, PartyPopper } from "lucide-react";

interface BookingSuccessModalProps {
  show: boolean;
  customerName?: string;
  serviceName?: string;
  dateLabel?: string;
}

// Confetti stays inside the theme's palette (gold tones) with a couple of
// festive accent colors so it still reads as a "party" burst.
const CONFETTI_COLORS = [
  "hsl(var(--gold))",
  "hsl(var(--gold-light))",
  "hsl(var(--gold-dark))",
  "#ffffff",
  "#ff8a65",
  "#4ecdc4",
  "#ffd93d",
];

type Particle = {
  id: string;
  dx: number;
  dy: number;
  size: number;
  color: string;
  rotate: number;
  delay: number;
  duration: number;
  shape: "circle" | "rect";
};

// Builds one "cracker" burst of particles launching up and outward from a
// bottom corner, like a party popper going off.
const makeBurst = (side: "left" | "right", count: number): Particle[] =>
  Array.from({ length: count }).map((_, i) => {
    const angle =
      side === "left"
        ? -20 - Math.random() * 70 // fan up-and-right from bottom-left
        : 200 + Math.random() * 70; // fan up-and-left from bottom-right
    const distance = 220 + Math.random() * 300;
    const rad = (angle * Math.PI) / 180;
    return {
      id: `${side}-${i}`,
      dx: Math.cos(rad) * distance,
      dy: Math.sin(rad) * distance,
      size: 6 + Math.random() * 8,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      rotate: Math.random() * 720 - 360,
      delay: Math.random() * 0.25,
      duration: 1.1 + Math.random() * 0.7,
      shape: Math.random() > 0.5 ? "circle" : "rect",
    };
  });

const ConfettiBurst = ({ side }: { side: "left" | "right" }) => {
  // Recomputed only once per mount, so the burst pattern is fresh every
  // time the modal opens but doesn't jitter on re-renders while it's open.
  const particles = useMemo(() => makeBurst(side, 28), [side]);
  const cornerClass = side === "left" ? "bottom-4 left-4" : "bottom-4 right-4";

  return (
    <>
      {particles.map((p) => (
        <motion.span
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
          animate={{ x: p.dx, y: p.dy, opacity: 0, rotate: p.rotate }}
          transition={{ duration: p.duration, delay: p.delay, ease: "easeOut" }}
          className={`absolute ${cornerClass}`}
          style={{
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
          }}
        />
      ))}
    </>
  );
};

const BookingSuccessModal = ({ show, customerName, serviceName, dateLabel }: BookingSuccessModalProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
        >
          {/* Confetti bombs from both bottom corners */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <ConfettiBurst side="left" />
            <ConfettiBurst side="right" />
          </div>

          {/* Success card */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative bg-card rounded-3xl shadow-2xl border border-border px-8 py-10 max-w-sm w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300, damping: 15 }}
              className="w-16 h-16 mx-auto mb-5 rounded-full gradient-gold flex items-center justify-center shadow-lg"
            >
              <Check className="w-8 h-8 text-primary-foreground" strokeWidth={2.5} />
            </motion.div>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2">
              <PartyPopper className="w-5 h-5 text-primary" />
              Congratulations{customerName ? `, ${customerName}` : ""}!
            </h3>
            <p className="text-muted-foreground text-sm">
              Your appointment is booked successfully.
            </p>
            {(serviceName || dateLabel) && (
              <p className="text-sm font-medium text-primary mt-3">
                {serviceName}
                {serviceName && dateLabel ? " · " : ""}
                {dateLabel}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-5">Redirecting to your dashboard…</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingSuccessModal;
