import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-24 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="section-heading mb-2 text-center">Get in Touch</h1>
        <p className="text-muted-foreground text-center mb-12">We'd love to hear from you</p>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Visit Us</h3>
                <p className="text-sm text-muted-foreground">123 Beauty Street, New York, NY 10001</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Call Us</h3>
                <p className="text-sm text-muted-foreground">+1 (555) 000-0000</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Us</h3>
                <p className="text-sm text-muted-foreground">hello@booksalon.com</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Name</label>
                <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <input type="email" placeholder="you@example.com" className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Message</label>
                <textarea rows={4} placeholder="Your message..." className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>
              <button className="btn-gold w-full">Send Message</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default Contact;
