import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [needsSignup, setNeedsSignup] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as { from?: string; justRegistered?: boolean } | null;
  const redirectTo = state?.from || "/dashboard";

  const handleSubmit = async () => {
    setError("");
    setNeedsSignup(false);

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setSubmitting(true);
    const result = await login({ email: email.trim(), password });
    setSubmitting(false);

    if (!result.success) {
      setError(result.error || "Unable to sign in.");
      if (result.error?.toLowerCase().includes("not found")) {
        setNeedsSignup(true);
      }
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background grid lg:grid-cols-2">
      {/* Editorial image side — hidden on small screens */}
      <div className="hidden lg:block relative overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-primary/25 blur-3xl animate-blob-b" />
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
            Where Style Meets <span className="text-primary">Precision</span>
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
          <h1 className="font-heading text-2xl font-bold mb-1">Welcome Back</h1>
          <p className="text-sm text-muted-foreground">
            {location.state ? "Please sign in to continue booking your appointment" : "Sign in to your account"}
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-lg transition-shadow">
          <div className="space-y-4">
            {state?.justRegistered && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-700">Account created! Sign in with your new password to continue.</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-xs text-red-600">
                  {error}
                  {needsSignup && (
                    <>
                      {" "}
                      <Link to="/signup" state={location.state} className="font-semibold underline">
                        Create one now
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>
            )}
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <button onClick={handleSubmit} disabled={submitting} className="btn-gold btn-press-3d w-full block text-center">
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              state={location.state}
              className="text-primary font-medium hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
        
      </motion.div>
      </div>
    </div>
  );
};

export default Login;
