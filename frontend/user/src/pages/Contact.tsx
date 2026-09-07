import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Twitter, Send } from "lucide-react";
import PhoneInput from "@/components/PhoneInput";
import { isValidEmail, isValidIndianPhone } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

const contactInfo = {
  address: "Nagpur, India",
  phone: "+91 34563 23489",
  phoneDigits: "913456323489",
  email: "hello@glamaura.com",
  hours: [
    { day: "Monday - Saturday", time: "9:00 AM - 8:00 PM" },
    { day: "Sunday", time: "10:00 AM - 6:00 PM" },
  ],
  social: [
    { icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
    { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
  ],
};

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const { toast } = useToast();

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};

    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (!phone) {
      nextErrors.phone = "Phone number is required.";
    } else if (!isValidIndianPhone(phone)) {
      nextErrors.phone = "Enter a valid 10-digit phone number.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    toast({ title: "Message sent", description: "We'll get back to you shortly." });
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        eyebrow="Get In Touch"
        title="Contact Us"
        description="Questions, feedback or ready to book? We'd love to hear from you."
        crumbs={[{ label: "Contact" }]}
      />

      {/* Quick actions - one-tap call / WhatsApp / email, most useful on mobile */}
      <div className="px-4 -mt-6 relative z-10">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <a
              href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
              className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 bg-card border border-border rounded-2xl py-4 sm:py-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full gradient-gold flex items-center justify-center">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </span>
              <span className="text-xs sm:text-sm font-medium">Call Us</span>
            </a>
            <a
              href={`https://wa.me/${contactInfo.phoneDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 bg-card border border-border rounded-2xl py-4 sm:py-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full gradient-gold flex items-center justify-center">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </span>
              <span className="text-xs sm:text-sm font-medium">WhatsApp</span>
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 bg-card border border-border rounded-2xl py-4 sm:py-5 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full gradient-gold flex items-center justify-center">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
              </span>
              <span className="text-xs sm:text-sm font-medium">Email</span>
            </a>
          </div>
        </div>
      </div>

      <div className="py-14 sm:py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {/* Info card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="gradient-gold px-6 py-8 sm:px-8 sm:py-10">
                <h3 className="font-heading text-xl sm:text-2xl font-bold text-primary-foreground mb-1">
                  Let's Talk
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  Reach out any way that's convenient for you.
                </p>
              </div>

              <div className="p-6 sm:p-8 space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Visit Us</h4>
                    <p className="text-sm text-muted-foreground">{contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Call Us</h4>
                    <p className="text-sm text-muted-foreground">{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-0.5">Email Us</h4>
                    <p className="text-sm text-muted-foreground">{contactInfo.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1.5">Business Hours</h4>
                    <div className="space-y-1">
                      {contactInfo.hours.map((h) => (
                        <div key={h.day} className="flex items-center justify-between text-sm text-muted-foreground gap-3">
                          <span>{h.day}</span>
                          <span className="text-foreground font-medium whitespace-nowrap">{h.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social links */}
                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm mb-3">Follow Us</h4>
                  <div className="flex items-center gap-3">
                    {contactInfo.social.map((s) => (
                      <a
                        key={s.label}
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <s.icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm"
            >
              <h3 className="font-heading text-lg font-semibold mb-5">Send Us a Message</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                      errors.email ? "border-red-500" : "border-border"
                    }`}
                  />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <PhoneInput value={phone} onChange={setPhone} error={!!errors.phone} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Message</label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Your message..."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
                <button
                  onClick={handleSubmit}
                  className="btn-gold btn-pulse-ring w-full flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </div>
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 md:mt-10 rounded-2xl overflow-hidden border border-border shadow-sm h-64 sm:h-80"
          >
            <iframe
              title="Glam Aura location"
              src="https://maps.google.com/maps?q=Nagpur%2C%20India&z=13&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
