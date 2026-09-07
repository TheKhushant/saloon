import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Scissors, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <section className="relative flex-1 flex items-center justify-center overflow-hidden bg-black py-32">
        <img
          src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1600"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-blob-c" />

        <div className="relative z-10 text-center px-6">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-primary text-xs font-semibold tracking-[0.25em] uppercase mb-6"
          >
            <Scissors className="w-3.5 h-3.5" /> Glam Aura
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-heading text-8xl md:text-[10rem] font-bold text-white leading-none mb-4"
          >
            4<span className="text-gradient-gold">0</span>4
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16 }}
            className="text-white/70 text-lg max-w-md mx-auto mb-10"
          >
            This page has been trimmed away. Let's get you back to a look that suits you.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Home
            </Link>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default NotFound;
