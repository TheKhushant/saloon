import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import PhoneInput from "@/components/PhoneInput";
import { isValidEmail, isValidIndianPhone } from "@/lib/validators";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string; password?: string; form?: string }>({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async () => {
    const nextErrors: typeof errors = {};

    if (!name.trim()) {
      nextErrors.form = "Please fill in all fields.";
    }
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
    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    const result = await signup({ name: name.trim(), email: email.trim(), phone, password });
    setSubmitting(false);

    if (!result.success) {
      setErrors({ form: result.error });
      return;
    }

    // Registration doesn't log the customer in automatically - they land on
    // /login and sign in for real with the credentials they just chose.
    // Whatever page they were trying to reach before signing up (e.g. a
    // booking in progress) is carried along so login can still send them
    // there afterward.
    navigate("/login", { state: { ...(location.state as object), justRegistered: true }, replace: true });
  };

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      <div className="hidden lg:block relative overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="absolute -bottom-16 -right-16 w-72 h-72 rounded-full bg-primary/25 blur-3xl animate-blob-a" />
        <div className="relative z-10 h-full flex flex-col justify-end p-12">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 text-primary text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          >
            <Scissors className="w-3.5 h-3.5" /> Glam Aura
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-heading text-4xl font-bold text-white leading-tight max-w-sm"
          >
            Join a Community Devoted to <span className="text-primary">Great Style</span>
          </motion.h2>
        </div>
      </div>

      <div className="flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-10 h-10 gradient-gold rounded-lg flex items-center justify-center">
              <Scissors className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-heading text-2xl font-bold text-foreground">Glam Aura</span>
          </Link>
          <h1 className="font-heading text-2xl font-bold mb-1">Create Account</h1>
          <p className="text-sm text-muted-foreground">
            {location.state ? "Create an account to continue booking your appointment" : "Join Glam Aura today"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-lg transition-shadow">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 ${
                  errors.email ? "border-red-500" : "border-border"
                }`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Phone <span className="text-red-500">*</span>
              </label>
              <PhoneInput value={phone} onChange={setPhone} error={!!errors.phone} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 pr-12"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>
            {errors.form && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-xs text-red-600">
                  {errors.form}
                  {errors.form.toLowerCase().includes("sign in") && (
                    <>
                      {" "}
                      <Link to="/login" state={location.state} className="font-semibold underline">
                        Sign in
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
            )}
            <button onClick={handleSubmit} disabled={submitting} className="btn-gold btn-bounce w-full block text-center">
              {submitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" state={location.state} className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default Signup;
