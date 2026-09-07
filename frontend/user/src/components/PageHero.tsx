import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight, Scissors } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  image?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600";

/**
 * Dark, full-bleed editorial banner used at the top of every inner page —
 * mirrors the DreamSalon "inner page" hero: dark photo, gold eyebrow tag,
 * large serif heading and a breadcrumb trail.
 */
const PageHero = ({ eyebrow = "Glam Aura", title, description, crumbs, image }: PageHeroProps) => {
  return (
    <section className="relative overflow-hidden bg-black pt-36 pb-16 md:pt-44 md:pb-20">
      <img
        src={image || DEFAULT_IMAGE}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-primary/20 blur-3xl animate-blob-a" />

      <div className="container relative z-10 mx-auto px-6 md:px-10">
        <motion.span
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 text-primary text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4"
        >
          <Scissors className="w-3.5 h-3.5" />
          {eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4"
        >
          {title}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-white/70 max-w-xl mb-6"
          >
            {description}
          </motion.p>
        )}

        {crumbs && crumbs.length > 0 && (
          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-1.5 text-sm text-white/60"
          >
            <Link to="/" className="hover:text-primary transition-colors underline-grow">
              Home
            </Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <ChevronRight className="w-3.5 h-3.5 text-white/30" />
                {c.href ? (
                  <Link to={c.href} className="hover:text-primary transition-colors underline-grow">
                    {c.label}
                  </Link>
                ) : (
                  <span className="text-primary">{c.label}</span>
                )}
              </span>
            ))}
          </motion.nav>
        )}
      </div>
    </section>
  );
};

export default PageHero;
