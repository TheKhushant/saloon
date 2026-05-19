import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Shield, Clock, Scissors, Calendar, Phone, MapPin, CheckCircle, SprayCanIcon as Spray, Wind, Sparkles, ScissorsIcon as Scissors2, Droplet, Eye, Moon } from "lucide-react";
import { Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { featuredServices, reviews, blogPosts } from "@/data/mockData";
import QuickBooking from "./QuickBooking";

// Single salon information (you can move this to a config file later)
const salonInfo = {
  name: "Glamour & Grace Salon",
  tagline: "Premium Beauty & Wellness Services",
  description: "Experience luxury beauty treatments in a relaxing environment",
  address: "123 Beauty Lane, Manhattan, NY 10001",
  phone: "+1 (212) 555-0123",
  email: "hello@glamourgrace.com",
  hours: "Mon-Sat: 9am - 8pm | Sun: 10am - 6pm",
  rating: 4.8,
  totalReviews: 528
};

const Index = () => {
  // Floating animation variants
  const floatAnimation: Variants = {
    initial: { y: 0 },
    animate: (custom) => ({
      y: [0, -20, 0],
      rotate: [0, custom?.rotate || 5, 0],
      transition: {
        duration: custom?.duration || 4,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: custom?.delay || 0
      }
    })
  };

  // Salon-themed floating icons
  const floatingIcons = [
    { Icon: Scissors, color: "text-pink-400", size: 32, top: "10%", left: "5%", duration: 5, rotate: 10 },
    { Icon: Scissors2, color: "text-purple-400", size: 28, top: "70%", left: "8%", duration: 6, rotate: -5 },
    { Icon: Spray, color: "text-blue-400", size: 30, top: "20%", right: "5%", duration: 4.5, rotate: 15 },
    { Icon: Wind, color: "text-amber-400", size: 34, top: "80%", right: "10%", duration: 5.5, rotate: -10 },
    { Icon: Droplet, color: "text-cyan-400", size: 24, top: "40%", left: "15%", duration: 4, rotate: 0 },
    { Icon: Sparkles, color: "text-yellow-400", size: 28, top: "15%", right: "15%", duration: 3.5, rotate: 20 },
    { Icon: Eye, color: "text-emerald-400", size: 26, top: "60%", right: "20%", duration: 5, rotate: -15 },
    { Icon: Moon, color: "text-indigo-400", size: 30, top: "85%", left: "12%", duration: 4.8, rotate: 8 },
    { Icon: Star, color: "text-amber-400", size: 22, top: "30%", right: "25%", duration: 3.8, rotate: 0 },
    { Icon: Star, color: "text-pink-400", size: 20, top: "75%", right: "30%", duration: 4.2, rotate: 0 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section - Single Salon Focus */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background with Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          
          {/* Floating Salon Icons */}
          {floatingIcons.map((item, index) => (
            <motion.div
              key={index}
              className="absolute opacity-20 md:opacity-30"
              style={{
                top: item.top,
                left: item.left,
                right: item.right,
                zIndex: 0
              }}
              variants={floatAnimation}
              initial="initial"
              animate="animate"
              custom={{ duration: item.duration, rotate: item.rotate }}
            >
              <item.Icon 
                className={`${item.color} w-${item.size} h-${item.size}`}
                size={item.size}
                strokeWidth={1.5}
              />
            </motion.div>
          ))}

          {/* Floating Bubbles/Circles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              className="absolute rounded-full bg-primary/5"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}

          {/* Animated Gradient Orbs */}
          <motion.div
            className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-pink-300/20 to-purple-300/20 rounded-full blur-3xl"
            animate={{
              x: [0, 50, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-amber-300/20 to-orange-300/20 rounded-full blur-3xl"
            animate={{
              x: [0, -50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Hair Strand Animation */}
          <svg className="absolute top-0 left-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hair-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 0 Q30 10 20 20 Q10 30 20 40" stroke="currentColor" fill="none" strokeWidth="2" className="text-primary" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#hair-pattern)" />
          </svg>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium backdrop-blur-sm">
              <CheckCircle className="w-4 h-4" />
              Welcome to {salonInfo.name}
            </span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight mb-6"
          >
            Where Beauty Meets<br /><span className="text-gradient-gold">Elegance</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 backdrop-blur-sm bg-background/10 p-4 rounded-2xl"
          >
            {salonInfo.description}. Book your appointment today and let our expert stylists transform your look.
          </motion.p>

          {/* Contact Info Strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mb-10 text-sm text-muted-foreground backdrop-blur-sm bg-background/10 p-3 rounded-full"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span>{salonInfo.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              <span>{salonInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span>{salonInfo.hours}</span>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/quickbooking" className="btn-gold px-8 py-4 text-lg relative overflow-hidden group">
              <span className="relative z-10">Book Appointment</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </Link>
            <Link to="/service" className="btn-gold-outline px-8 py-4 text-lg relative overflow-hidden group">
              <span className="relative z-10">View Services</span>
              <motion.div
                className="absolute inset-0 bg-primary/10"
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </Link>
          </motion.div>
        </div>
      </section>


      {/* Quick Stats */}
      <QuickBooking/>
      <section className="py-12 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { number: "15+", label: "Expert Stylists" },
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
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Now focusing on salon's services */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-14">
            <h2 className="section-heading mb-3">Our Premium Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From classic cuts to luxury treatments, we offer a complete range of beauty services
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-salon p-6 text-center cursor-pointer group hover:border-primary/30"
                onClick={() => window.location.href = `/services#${service.id}`}
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{service.icon}</div>
                <h3 className="font-semibold text-sm text-foreground">{service.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{service.description}</p>
                {/* <p className="text-xs text-muted-foreground mt-1">from ${service.price}</p> */}
                <p className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  Book Now →
                </p>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Link to="/services" className="text-primary hover:underline font-medium">
              View All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us - Personalized for single salon */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="section-heading text-center mb-14">Why Choose <span className="text-gradient-gold">{salonInfo.name}</span></h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Expert Stylists", desc: "Certified professionals with 5+ years experience" },
              { icon: Star, title: "Premium Products", desc: "Using top-tier beauty & hair care brands" },
              { icon: Clock, title: "Flexible Hours", desc: "Open 7 days a week with evening appointments" },
              { icon: Scissors, title: "Customized Service", desc: "Personalized treatments for your needs" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 rounded-2xl bg-card border border-border hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews - Now showing salon-specific reviews */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-heading mb-2">Client Reviews</h2>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-lg font-semibold">{salonInfo.rating}</span>
                <span className="text-muted-foreground">({salonInfo.totalReviews} reviews)</span>
              </div>
            </div>
            <Link to="/reviews" className="text-primary hover:underline text-sm font-medium">
              Write a Review
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review, i) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-card border border-border"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">"{review.comment}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 gradient-gold rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {review.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <h2 className="section-heading text-center mb-14">Beauty Tips & Insights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-salon cursor-pointer"
                onClick={() => window.location.href = `/blog/${post.id}`}
              >
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
                <div className="p-5">
                  <span className="text-xs font-medium text-primary">{post.category}</span>
                  <h3 className="font-heading font-semibold mt-1 mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{post.excerpt}</p>
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - Direct booking focus */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="gradient-gold rounded-3xl p-12 md:p-16 text-center text-primary-foreground">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">Ready for Your Transformation?</h2>
            <p className="opacity-90 mb-8 max-w-lg mx-auto text-lg">
              Book your appointment now and get 20% off on your first visit
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/book" className="bg-white text-primary hover:bg-white/90 px-8 py-4 rounded-xl font-semibold transition-colors">
                Book Online Now
              </Link>
              <a href={`tel:${salonInfo.phone}`} className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Call to Book
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;