import { useState, MouseEvent, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface RippleSpot {
  id: number;
  x: number;
  y: number;
  size: number;
}

interface RippleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  rippleColor?: string;
}

/**
 * Button that spawns an expanding circle from the exact point the user
 * clicked, then fades it out — a tactile "material" style press animation.
 * Use it anywhere a plain <button> would go.
 */
const RippleButton = ({ className, children, onClick, rippleColor, ...props }: RippleButtonProps) => {
  const [ripples, setRipples] = useState<RippleSpot[]>([]);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const spot: RippleSpot = {
      id: Date.now(),
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
    };
    setRipples((prev) => [...prev, spot]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== spot.id));
    }, 600);
    onClick?.(e);
  };

  return (
    <button className={cn("btn-ripple", className)} onClick={handleClick} {...props}>
      {children}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="btn-ripple-circle"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            background: rippleColor,
          }}
        />
      ))}
    </button>
  );
};

export default RippleButton;
