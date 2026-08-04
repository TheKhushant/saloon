import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Phone, ChevronLeft, LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { salons, serviceCategories, reviews as mockReviews, timeSlots, stylists } from "@/data/mockData";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/context/BookingsContext";

const allServices = [
  ...serviceCategories.hair,
  ...serviceCategories.beard,
  ...serviceCategories.spa,
  ...serviceCategories.combo,
];

const SalonDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addBooking } = useBookings();
  const salon = salons.find((s) => s.id === id);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedBarber, setSelectedBarber] = useState<number | null>(null);
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);

  if (!salon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="section-heading mb-4">Salon Not Found</h1>
          <Link to="/salons" className="btn-gold">Browse Salons</Link>
        </div>
      </div>
    );
  }

  const salonServices = allServices.filter((s) =>
    salon.services.some((ss) => s.name.toLowerCase().includes(ss.toLowerCase()))
  );
  const displayServices = salonServices.length > 0 ? salonServices : allServices.slice(0, 5);

  const parseAppointmentDateTime = (dateStr: string, timeStr: string): Date => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const result = new Date(dateStr);
    result.setHours(hours, minutes, 0, 0);
    return result;
  };

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/salon/${id}` } });
      return;
    }
    if (selectedService && selectedDate && selectedTime) {
      const service = displayServices.find((s) => s.id === selectedService);
      const barber = stylists.find((st) => st.id === selectedBarber);
      addBooking({
        service: service?.name || "Service",
        barber: barber?.name || "Any Available Barber",
        branch: salon.location,
        date: parseAppointmentDateTime(selectedDate, selectedTime),
        duration: service?.duration || "30 min",
        price: service?.price || 0,
      });
      setShowBookingConfirm(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-20">
        {/* Header Image */}
        <div className="relative h-64 md:h-96 overflow-hidden">
          <img src={salon.images[0]} alt={salon.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
          <div className="absolute bottom-6 left-6">
            <Link to="/salons" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3">
              <ChevronLeft className="w-4 h-4" /> Back to Salons
            </Link>
          </div>
        </div>

        <div className="container mx-auto px-4 -mt-12 relative z-10">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6">
                <h1 className="font-heading text-3xl font-bold mb-2">{salon.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {salon.location}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {salon.openTime} - {salon.closeTime}</span>
                  <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {salon.phone}</span>
                </div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(salon.rating) ? "fill-primary text-primary" : "text-border"}`} />
                    ))}
                  </div>
                  <span className="font-semibold">{salon.rating}</span>
                  <span className="text-sm text-muted-foreground">({salon.reviews} reviews)</span>
                </div>
                <p className="text-muted-foreground">{salon.description}</p>
              </motion.div>

              {/* Services */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">Services & Pricing</h2>
                <div className="space-y-3">
                  {displayServices.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                        selectedService === service.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-medium text-foreground">{service.name}</p>
                        <p className="text-xs text-muted-foreground">{service.duration}</p>
                      </div>
                      <span className="font-semibold text-primary">${service.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reviews */}
              <div className="bg-card rounded-2xl border border-border p-6">
                <h2 className="font-heading text-xl font-semibold mb-4">Reviews</h2>
                <div className="space-y-4">
                  {mockReviews.map((r) => (
                    <div key={r.id} className="p-4 rounded-xl bg-secondary/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 gradient-gold rounded-full flex items-center justify-center text-primary-foreground text-xs font-semibold">
                          {r.avatar}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{r.name}</p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: r.rating }).map((_, j) => (
                              <Star key={j} className="w-3 h-3 fill-primary text-primary" />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-muted-foreground">{r.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card rounded-2xl border border-border p-6 space-y-6">
                <h2 className="font-heading text-xl font-semibold">Book Appointment</h2>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Time</label>
                  <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {timeSlots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`text-xs py-2 rounded-lg border transition-all ${
                          selectedTime === t
                            ? "border-primary bg-primary/10 text-primary font-medium"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Barber (Optional)</label>
                  <div className="space-y-2">
                    {stylists.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setSelectedBarber(st.id === selectedBarber ? null : st.id)}
                        className={`w-full text-left p-3 rounded-xl border text-sm transition-all ${
                          selectedBarber === st.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <p className="font-medium">{st.name}</p>
                        <p className="text-xs text-muted-foreground">{st.specialty} · ⭐ {st.rating}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleBook}
                  disabled={isAuthenticated && (!selectedService || !selectedDate || !selectedTime)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                    isAuthenticated
                      ? "btn-gold disabled:opacity-40 disabled:cursor-not-allowed"
                      : "bg-muted text-muted-foreground hover:opacity-90"
                  }`}
                >
                  {isAuthenticated ? (
                    "Confirm Booking"
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Login to Book
                    </>
                  )}
                </button>
                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground text-center">
                    You need to be logged in to book an appointment.
                  </p>
                )}

                {showBookingConfirm && (
                  <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm">
                    ✅ Booking confirmed! Check your dashboard for details.
                  </div>
                )}
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
