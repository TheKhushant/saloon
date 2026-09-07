import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Scissors, User, LogOut, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/salons", label: "Services" },
    { to: "/products", label: "Products" },
    { to: "/blog", label: "Blog" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,.08)] border-b border-black/5"
          : "bg-black/25 backdrop-blur-[2px] border-b border-white/10"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16 md:h-20 md:grid md:grid-cols-[1fr_auto_1fr]">
          <div className="hidden md:flex items-center gap-7 md:order-1 md:justify-self-start">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`underline-grow text-[13px] font-medium tracking-wide transition-colors duration-300 ${
                  isActive(link.to)
                    ? "text-primary"
                    : scrolled ? "text-black/65 hover:text-black" : "text-white/75 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <Link to="/" className="flex items-center gap-2 md:order-2 md:justify-self-center group">
            <img
              src="/logo.svg"
              alt="Glam Aura logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain transition-transform duration-500 group-hover:rotate-6"
            />
            <span className={`font-heading text-xl font-bold transition-colors ${scrolled ? "text-black" : "text-white"}`}>
              Glam Aura
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-4 md:order-3 md:justify-self-end">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`flex items-center gap-1.5 text-sm transition-colors ${scrolled ? "text-black/65 hover:text-black" : "text-white/70 hover:text-white"}`}>
                  <User className="w-4 h-4" /> {user?.name || "Dashboard"}
                </Link>
                <button onClick={handleLogout} className={`flex items-center gap-1.5 text-sm transition-colors btn-icon-pop ${scrolled ? "text-black/65 hover:text-black" : "text-white/70 hover:text-white"}`}>
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </>
            ) : (
              <Link to="/login" aria-label="Log in" className="uiverse-login-btn">
                <span className="uiverse-login-btn-inner">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="m15.626 11.769a6 6 0 1 0 -7.252 0 9.008 9.008 0 0 0 -5.374 8.231 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 9.008 9.008 0 0 0 -5.374-8.231zm-7.626-4.769a4 4 0 1 1 4 4 4 4 0 0 1 -4-4zm10 14h-12a1 1 0 0 1 -1-1 7 7 0 0 1 14 0 1 1 0 0 1 -1 1z" />
                  </svg>
                  <span>Log In</span>
                </span>
              </Link>
            )}
            <Link
              to="/quickbooking"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/25 btn-bubble-burst"
            >
              <Calendar className="w-4 h-4" /> Book Appointment
            </Link>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button
              className={`transition-colors ${scrolled ? "text-black" : "text-white"}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className={`md:hidden pb-5 border-t mt-1 pt-4 space-y-3 ${scrolled ? "border-black/10 bg-white/95" : "border-white/10 bg-black/90"}`}>
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setIsOpen(false)}
                className={`block text-sm font-medium ${scrolled ? "text-black/70 hover:text-black" : "text-white/75 hover:text-white"}`}>
                {link.label}
              </Link>
            ))}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-sm font-medium"> {user?.name || "Dashboard"} </Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="text-sm font-medium">Log out</button>
                </>
              ) : (
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-sm font-medium btn-underline-slide">Log in</Link>
              )}
              <Link to="/quickbooking" onClick={() => setIsOpen(false)}
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full btn-bubble-burst">
                <Calendar className="w-4 h-4" /> Book Appointment
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
