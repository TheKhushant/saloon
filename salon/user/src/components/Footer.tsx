import { Link } from "react-router-dom";
import { Scissors, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="gradient-dark text-accent-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 gradient-gold rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-xl font-bold">Glam Aura</span>
          </div>
          <p className="text-sm opacity-70 leading-relaxed">
            Your premium destination for men's grooming & wellness booking. Discover top barbershops near you.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm opacity-70">
            <Link to="/salons" className="block hover:opacity-100 transition-opacity">Find Barbershops</Link>
            <Link to="/blog" className="block hover:opacity-100 transition-opacity">Grooming Blog</Link>
            <Link to="/contact" className="block hover:opacity-100 transition-opacity">Contact Us</Link>
            <Link to="/login" className="block hover:opacity-100 transition-opacity">Login</Link>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4">Services</h4>
          <div className="space-y-2 text-sm opacity-70">
            <p>Haircut & Styling</p>
            <p>Beard & Shave</p>
            <p>Spa & Massage</p>
            <p>Grooming Packages</p>
          </div>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-4">Contact</h4>
          <div className="space-y-3 text-sm opacity-70">
            <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Nagpur, India</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 34563 23489</div>
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@glamaura.com</div>
          </div>
        </div>
      </div>
      <div className="border-t border-accent-foreground/10 mt-12 pt-8 text-center text-sm opacity-50">
        © 2026 Glam Aura. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
