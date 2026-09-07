import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, Scissors, Phone, ArrowUpRight, Mail } from "lucide-react";
import { Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewsCarousel from "@/components/ReviewsCarousel";
import WhyChooseUs from "@/components/WhyChooseUs";
import { featuredServices, blogPosts } from "@/data/mockData";
import QuickBooking from "./QuickBooking";

// The homepage's "featured services" tiles use their own simplified list
// (see mockData), so each tile is mapped to the closest matching entry in
// the full services catalog that /service/:id actually renders.
const featuredServiceDetailId: Record<number, number> = {
  1: 1, // Haircut -> Premium Haircut
  2: 4, // Beard Trim -> Royal Beard Grooming
  3: 5, // Hot Towel Shave -> Hot Towel Razor Shave
  4: 8, // Hair Spa -> Head Massage (Aromatherapy)
  5: 7, // Men's Facial -> Men's Facial - Gold
  6: 8, // Head Massage -> Head Massage (Aromatherapy)
};

// Single salon information (you can move this to a config file later)
const salonInfo = {
  name: "Glam Aura",
  tagline: "Premium Men's Grooming & Barbering",
  description: "Experience expert barbering and grooming treatments in a relaxing environment",
  address: "Nagpur, India",
  phone: "+91 34563 23489",
  email: "hello@glamaura.com",
  hours: "Mon-Sat: 9am - 8pm | Sun: 10am - 6pm",
  rating: 4.8,
  totalReviews: 528
};

const Index = () => {
  const navigate = useNavigate();
  const [ctaVisible, setCtaVisible] = useState(false);
  const [ctaBgLoaded, setCtaBgLoaded] = useState(false);
  const ctaRef = useRef(null);

  useEffect(() => {
    const node = ctaRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const [heroImages, setHeroImages] = useState([
    "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600",
    // "https://images.unsplash.com/photo-1503951914875-452b3675c4c7?w=1600",
    "https://img.magnific.com/free-photo/handsome-bearded-man-barbershop-barber-work-making-photo-his-phone_627829-7389.jpg?semt=ais_hybrid&w=1600",
    "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1600",
  ]);

  // Clicking a thumbnail brings it to the front (becomes the hero background)
  // and swaps places with whichever image was active before.
  const selectHeroImage = (index: number) => {
    if (index === 0) return;
    setHeroImages((prev) => {
      const next = [...prev];
      [next[0], next[index]] = [next[index], next[0]];
      return next;
    });
  };

  // Auto-rotate the hero background every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImages((prev) => [...prev.slice(1), prev[0]]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - full-bleed dark editorial hero */}
      <section className="relative min-h-screen flex items-end overflow-hidden bg-black">
        {/* Background photo (crossfades when a thumbnail is selected) */}
        <AnimatePresence mode="sync">
          <motion.img
            key={heroImages[0]}
            src={heroImages[0]}
            alt="Barber at work"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Vertical "Scroll" marker */}
        <div className="hidden lg:flex flex-col items-center gap-3 absolute right-8 bottom-16 z-20 text-white/60">
          <span className="vertical-text text-xs tracking-[0.3em] uppercase">Scroll</span>
          <span className="w-px h-10 bg-white/40" />
        </div>

        {/* Vertical "Limited Offer" marker */}
        <div className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 z-20 text-white/50">
          <span className="vertical-text text-xs tracking-[0.25em] uppercase">
            Limited Offer : 20% Off First Booking
          </span>
        </div>

        <div className="container mx-auto px-5 sm:px-6 md:px-10 lg:pl-20 pt-28 sm:pt-40 pb-14 sm:pb-16 relative z-10">
          <div className="max-w-2xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-block text-primary text-sm md:text-base font-semibold tracking-[0.2em] uppercase underline decoration-2 underline-offset-[10px] mb-6"
            >
              Crafted with Perfection
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-body text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
            >
              Where Style Meets<br />
              <span className="text-primary">Precision</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/70 text-base sm:text-lg max-w-xl mb-8 sm:mb-10"
            >
              {salonInfo.description}. Book your appointment today and let our expert barbers transform your look.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-10 sm:mb-12"
            >
              <Link
                to="/quickbooking"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 sm:py-4 rounded-lg font-semibold transition-all btn-glow btn-shine hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Book Appointment <ArrowUpRight className="w-5 h-5" />
              </Link>
              <Link
                to="/service"
                className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-3.5 sm:py-4 rounded-lg font-semibold transition-all btn-outline-glow hover:bg-white/10 hover:-translate-y-0.5 w-full sm:w-auto"
              >
                Explore Services <ArrowUpRight className="w-5 h-5" />
              </Link>
            </motion.div>

            {/* Thumbnail strip — click one to swap it into the background */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex gap-3"
            >
              {heroImages.map((src, i) => (
                <motion.button
                  key={src}
                  type="button"
                  layout
                  onClick={() => selectHeroImage(i)}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  whileHover={{ y: i === 0 ? 0 : -4 }}
                  aria-label={i === 0 ? "Currently showing" : "Show this photo"}
                  className={`w-16 h-14 sm:w-20 sm:h-16 md:w-24 md:h-20 rounded-lg overflow-hidden border-2 shrink-0 transition-colors ${
                    i === 0 ? "border-primary" : "border-white/20 hover:border-white/50 cursor-pointer"
                  }`}
                >
                  <img src={src} alt="" className="w-full h-full object-cover pointer-events-none" />
                </motion.button>
              ))}
            </motion.div>

            {/* Compact hours/contact info for mobile - the glass panel below
                is desktop-only (absolutely positioned), so mobile needs its
                own inline version instead of losing this info entirely. */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="md:hidden grid grid-cols-1 gap-3 mt-6"
            >
              <div className="glass-dark rounded-2xl px-5 py-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5 text-primary" />
                  </span>
                  Opening Hours
                </div>
                <p className="text-white/70 text-xs">Mon - Fri: 9:30 AM - 7:30 PM</p>
                <p className="text-white/70 text-xs">Sat - Sun: 7:30 AM - 9:30 PM</p>
              </div>
              <div className="glass-dark rounded-2xl px-5 py-4">
                <div className="flex items-center gap-2 text-white font-semibold mb-2 text-sm">
                  <span className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                    <Phone className="w-3.5 h-3.5 text-primary" />
                  </span>
                  Contact For Booking
                </div>
                <p className="text-white/70 text-xs">{salonInfo.phone}</p>
                <p className="text-white/70 text-xs flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> {salonInfo.email}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Opening hours / contact glass panels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="hidden md:grid grid-cols-2 gap-4 absolute bottom-8 right-8 z-20"
        >
          <div className="glass-dark rounded-2xl px-6 py-5 min-w-[220px]">
            <div className="flex items-center gap-2 text-white font-semibold mb-3">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-primary" />
              </span>
              Opening Hours
            </div>
            <p className="text-white/70 text-sm">Mon - Fri: 9:30 AM - 7:30 PM</p>
            <p className="text-white/70 text-sm">Sat - Sun: 7:30 AM - 9:30 PM</p>
          </div>
          <div className="glass-dark rounded-2xl px-6 py-5 min-w-[220px]">
            <div className="flex items-center gap-2 text-white font-semibold mb-3">
              <span className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-primary" />
              </span>
              Contact For Booking
            </div>
            <p className="text-white/70 text-sm">{salonInfo.phone}</p>
            <p className="text-white/70 text-sm flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {salonInfo.email}
            </p>
          </div>
        </motion.div>
      </section>

      {/* Quick Stats */}
      <QuickBooking/>
      <section className="py-10 sm:py-12 px-4 bg-dark">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {[
              { number: "15+", label: "Expert Barbers" },
              { number: "5k+", label: "Happy Clients" },
              { number: "50+", label: "Services" },
              { number: "8+", label: "Years Experience" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">{stat.number}</div>
                <div className="text-xs sm:text-sm text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - signature services with imagery, echoing the salon's real work */}
      <section className="py-14 sm:py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-8 sm:mb-14">
            <span className="inline-flex items-center gap-2 text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              <Scissors className="w-3.5 h-3.5" />
              What We Offer
            </span>
            <h2 className="section-heading mb-3">Our Signature Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-2">
              From classic cuts to premium beard care, we offer a complete range of men's grooming services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
            {featuredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="group luxury-card relative rounded-2xl overflow-hidden cursor-pointer border border-border bg-card"
                onClick={() => {
                  const detailId = featuredServiceDetailId[service.id];
                  navigate(detailId ? `/service/${detailId}` : "/service");
                }}
              >
                <div className="luxury-image relative h-44 md:h-52 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <span className="absolute top-3 left-3 w-9 h-9 rounded-full gradient-gold flex items-center justify-center text-base shadow-md">
                    {service.icon}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-heading font-semibold text-white text-base md:text-lg mb-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-white/70 mb-2 line-clamp-2">{service.description}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all">
                    Book Now <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 px-4 sm:px-0">
            <Link
              to="/service"
              className="btn-glow-blob relative inline-block bg-neutral-800 text-center sm:text-left px-6 py-4 text-gray-50 text-base font-bold rounded-lg overflow-hidden w-full sm:w-auto"
            >
              <span className="btn-glow-blob-label">See All Services</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Personalized for single salon */}
      <WhyChooseUs salonName={salonInfo.name} />

      {/* Reviews - Rotating two-column carousel */}
      <ReviewsCarousel rating={salonInfo.rating} totalReviews={salonInfo.totalReviews} />

      {/* Blog */}
      <section className="py-14 sm:py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="section-heading text-center mb-8 sm:mb-14">Grooming Tips & Insights</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {blogPosts.slice(0, 3).map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-salon cursor-pointer"
                onClick={() => window.location.href = `/blog/${post.id}`}
              >
                <img src={post.image} alt={post.title} className="w-full h-44 sm:h-48 object-cover" />
                <div className="p-4 sm:p-5">
                  <span className="text-xs font-medium text-primary">{post.category}</span>
                  <h3 className="font-heading font-semibold mt-1 mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-10 px-4 sm:px-0">
            <Link
              to="/blog"
              className="btn-glow-blob relative inline-block bg-neutral-800 text-center sm:text-left px-6 py-4 text-gray-50 text-base font-bold rounded-lg overflow-hidden w-full sm:w-auto"
            >
              <span className="btn-glow-blob-label">See All Blogs</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA - Direct booking focus */}
      <section className="py-14 sm:py-20 px-4">
        <div className="container mx-auto">
          <div
            ref={ctaRef}
            className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-8 sm:p-12 md:p-20 text-center text-white shadow-2xl bg-dark"
          >
            {/* Background image only starts loading once this section
                scrolls into view, then fades in slowly, blurred behind a dark overlay. */}
            {ctaVisible && (
              <img
                src="https://images.unsplash.com/photo-1633681138600-295fcd688876?w=1200"
                alt=""
                aria-hidden="true"
                decoding="async"
                onLoad={() => setCtaBgLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover scale-110 blur+ transition-opacity duration-[2000ms] ease-out ${
                  ctaBgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/50" />

            <div className="relative z-10">
              <span className="inline-block text-gradient-gold text-sm md:text-base font-semibold tracking-[0.25em] uppercase mb-4">
                Limited Time Offer
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-5 tracking-tight leading-tight drop-shadow-lg">
                Ready for Your <span className="text-gradient-gold">Transformation?</span>
              </h2>
              <p className="text-white/90 mb-8 sm:mb-10 max-w-xl mx-auto text-base sm:text-lg md:text-xl font-light">
                Book your appointment now and get <span className="font-semibold text-white">20% off</span> on your first visit
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/book" className="bg-primary text-primary-foreground hover:bg-primary/90 px-10 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl btn-bounce w-full sm:w-auto">
                  Book Online Now
                </Link>
                <a href={`tel:${salonInfo.phone}`} className="bg-white/10 backdrop-blur-sm border-2 border-white/70 text-white hover:bg-white/20 px-10 py-3.5 sm:py-4 rounded-xl font-semibold text-base sm:text-lg transition-all flex items-center justify-center gap-2 btn-press-3d w-full sm:w-auto">
                  <Phone className="w-5 h-5" />
                  Call to Book
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;