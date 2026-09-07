import { Link } from "react-router-dom";
import { Scissors, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => (
  <footer className="gradient-dark text-accent-foreground">
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/logo.svg"
              alt="Glam Aura logo"
              className="w-9 h-9 rounded-lg object-cover"
            />
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
            <p>Spa & Masbrown</p>
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
      <div className="border-t border-accent-foreground/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm opacity-50">
        <span>© 2026 Glam Aura. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <Link to="/privacy-policy" className="hover:opacity-100 transition-opacity">Privacy Policy</Link>
          <Link to="/terms" className="hover:opacity-100 transition-opacity">Terms & Conditions</Link>
          <Link to="/refund-policy" className="hover:opacity-100 transition-opacity">Refund Policy</Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
