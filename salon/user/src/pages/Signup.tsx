import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const [errors, setErrors] = useState<{ email?: string; phone?: string; form?: string }>({});
  const { signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = (location.state as { from?: string })?.from || "/dashboard";

  const handleSubmit = () => {
    const nextErrors: typeof errors = {};

    if (!name.trim() || !password.trim()) {
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

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const result = signup({ name: name.trim(), email: email.trim(), password });
    if (!result.success) {
      setErrors({ form: result.error });
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
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

        <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
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
            <button onClick={handleSubmit} className="btn-gold w-full block text-center">Create Account</button>
          </div>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" state={location.state} className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
