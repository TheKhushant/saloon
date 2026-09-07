import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Scissors, AlertCircle, CheckCircle2, ArrowLeft, Mail } from "lucide-react";
import { forgotPasswordApi } from "@/lib/authApi";

type Step = "email" | "done";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async () => {
    setError("");
    const trimmed = email.trim();
    if (!trimmed) {
      setError("Please enter your email address.");
      return;
    }
    setSubmitting(true);
    try {
      // The backend always responds success here whether or not the email
      // exists, to avoid leaking which accounts are real - so this step
      // can't actually fail in a way worth showing the customer.
      await forgotPasswordApi(trimmed);
      setStep("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
            Back In, <span className="text-primary">Sharp as Ever</span>
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
            <h1 className="font-heading text-2xl font-bold mb-1">
              {step === "email" && "Forgot Password"}
              {step === "done" && "Check Your Email"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === "email" && "Enter the email linked to your account and we'll help you reset it."}
              {step === "done" && "If that email is linked to an account, we've sent a link to reset your password."}
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm hover:shadow-lg transition-shadow">
            {step === "email" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleEmailSubmit()}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-red-600">{error}</p>
                  </div>
                )}
                <button onClick={handleEmailSubmit} disabled={submitting} className="btn-gold btn-slide-fill w-full block text-center">
                  {submitting ? "Sending..." : "Continue"}
                </button>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors pt-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            )}


            {step === "done" && (
              <div className="text-center space-y-5">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Check your inbox for a link to reset your password. It may take a minute to arrive.
                </p>
                <button onClick={() => navigate("/login")} className="btn-gold btn-depth w-full block text-center">
                  Back to Sign In
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
