import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, ChevronLeft, Scissors, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchBranches, fetchBarbers, type ApiBranch, type ApiBarber } from "@/lib/bookingApi";
import { fetchPublicServices, type ApiService } from "@/lib/servicesApi";
import { fetchPublicSettings, type ApiSettings } from "@/lib/settingsApi";

const SalonDetails = () => {
  const { id } = useParams();
  const [branch, setBranch] = useState<ApiBranch | null>(null);
  const [services, setServices] = useState<ApiService[]>([]);
  const [barbers, setBarbers] = useState<ApiBarber[]>([]);
  const [settings, setSettings] = useState<ApiSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    Promise.all([fetchBranches(), fetchPublicServices({ branchId: id }), fetchBarbers(id), fetchPublicSettings()])
      .then(([branches, branchServices, branchBarbers, appSettings]) => {
        if (cancelled) return;
        const found = branches.find((b) => b.id === id);
        if (!found) {
          setNotFound(true);
          return;
        }
        setBranch(found);
        setServices(branchServices);
        setBarbers(branchBarbers);
        setSettings(appSettings);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading salon...</p>
      </div>
    );
  }

  if (notFound || !branch) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="section-heading mb-4">Salon Not Found</h1>
          <Link to="/salons" className="btn-gold btn-tilt">Browse Salons</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-4">
          <Link to="/salons" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to Salons
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6">
                <h1 className="font-heading text-3xl font-bold mb-2">{branch.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {branch.address && (
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {branch.address}</span>
                  )}
                  {settings && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {settings.openTime} - {settings.closeTime}
                    </span>
                  )}
                  {branch.phone && (
                    <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {branch.phone}</span>
                  )}
                </div>
              </motion.div>

              {/* Services */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-baseline justify-between mb-4">
                  <h2 className="font-heading text-xl font-semibold">Services & Pricing</h2>
                  <span className="text-xs text-muted-foreground">{services.length} Services</span>
                </div>
                {services.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No services are listed for this branch yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {services.map((service) => (
                      <Link
                        key={service.id}
                        to={`/book/${service.id}`}
                        className="relative flex items-center gap-3 p-4 rounded-xl border-2 border-border hover:border-primary/30 text-left transition-all"
                      >
                        <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <Scissors className="w-4 h-4 text-primary" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-foreground truncate">{service.name}</span>
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" /> {service.durationMinutes} min
                          </span>
                        </span>
                        <span className="font-semibold text-primary flex-shrink-0">₹{service.price}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Barbers */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">Meet the Team</h2>
                {barbers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No stylists are listed for this branch yet.</p>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {barbers.map((b) => (
                      <div key={b.id} className="flex items-center gap-3 p-4 rounded-xl bg-secondary/30">
                        <span className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 text-primary" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium text-foreground truncate">{b.name}</span>
                          {b.specialties && b.specialties.length > 0 && (
                            <span className="block text-xs text-muted-foreground truncate">
                              {b.specialties.join(", ")}
                            </span>
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 space-y-4">
                <h2 className="font-heading text-xl font-semibold">Ready to book?</h2>
                <p className="text-sm text-muted-foreground">
                  Pick a service above, or jump straight into booking and choose everything - service,
                  stylist, date and time - in one flow.
                </p>
                <Link
                  to={services[0] ? `/book/${services[0].id}` : "/service"}
                  className="block w-full text-center py-3 rounded-xl btn-gold btn-glow font-medium"
                >
                  Start Booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SalonDetails;
