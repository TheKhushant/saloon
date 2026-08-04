import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Phone, Mail } from "lucide-react";
import PhoneInput from "@/components/PhoneInput";
import { isValidEmail, isValidIndianPhone } from "@/lib/validators";
import { useToast } from "@/hooks/use-toast";

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
                  <p className="text-sm text-muted-foreground">Nagpur , India</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Call Us</h3>
                  <p className="text-sm text-muted-foreground">+91 34563 23489</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 gradient-gold rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email Us</h3>
                  <p className="text-sm text-muted-foreground">hello@glamaura.com</p>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-2xl border border-border p-8">
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
                <button onClick={handleSubmit} className="btn-gold w-full">Send Message</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
