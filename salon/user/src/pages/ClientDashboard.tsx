import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Scissors,
  Calendar,
  User,
  Clock,
  Heart,
  LogOut,
  Lock,
  Timer,
  ShieldCheck,
  Sparkles,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  CircleDot,
  Eye,
  Phone,
  CalendarPlus,
  Tag,
} from "lucide-react";
import { differenceInMinutes, format, isAfter } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useBookings, Booking, BookingStatus } from "@/context/BookingsContext";

const CANCEL_WINDOW_MINUTES = 60;

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: "bg-primary/15 text-primary border border-primary/30",
  Pending: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
  Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border border-red-500/30",
};

const statusIcons: Record<BookingStatus, JSX.Element> = {
  Confirmed: <ShieldCheck className="w-3 h-3" />,
  Pending: <Loader2 className="w-3 h-3" />,
  Completed: <CheckCircle2 className="w-3 h-3" />,
  Cancelled: <XCircle className="w-3 h-3" />,
};

type Tab = "bookings" | "profile" | "favorites";

const ClientDashboard = () => {
  const [tab, setTab] = useState<Tab>("bookings");
  const { bookings, cancelBooking } = useBookings();
  const [now, setNow] = useState(new Date());
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [detailTarget, setDetailTarget] = useState<Booking | null>(null);
  const { toast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: "/dashboard" }, replace: true });
    }
  }, [user, navigate]);

  // Keep countdowns / lock states live
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(interval);
  }, []);

  if (!user) return null;

  const tabs = [
    { id: "bookings" as const, label: "My Appointments", icon: Calendar },
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "favorites" as const, label: "Favorite Barbers", icon: Heart },
  ];

  // Most recently booked appointments shown first
  const sortedBookings = [...bookings].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const minutesUntil = (date: Date) => differenceInMinutes(date, now);

  const getLockInfo = (b: Booking) => {
    const isActiveStatus = b.status === "Confirmed" || b.status === "Pending";
    const minsLeft = minutesUntil(b.date);
    const alreadyPast = !isAfter(b.date, now);
    const withinCancelWindow = minsLeft < CANCEL_WINDOW_MINUTES;
    const locked = !isActiveStatus || alreadyPast || withinCancelWindow;
    return { locked, minsLeft, isActiveStatus, alreadyPast };
  };

  const countdownLabel = (b: Booking) => {
    const { alreadyPast } = getLockInfo(b);
    if (b.status === "Completed") return "Completed";
    if (b.status === "Cancelled") return "Cancelled";
    if (alreadyPast) return "In progress";
    const mins = minutesUntil(b.date);
    if (mins < 60) return `Starts in ${mins} min`;
    const hours = Math.floor(mins / 60);
    const rem = mins % 60;
    if (hours < 24) return `Starts in ${hours}h ${rem}m`;
    const days = Math.floor(hours / 24);
    return `In ${days} day${days > 1 ? "s" : ""}`;
  };

  const requestCancel = (b: Booking) => {
    const { locked } = getLockInfo(b);
    if (locked) {
      toast({
        title: "Can't cancel this appointment",
        description: "Appointments can only be cancelled up to 1 hour before the scheduled time.",
        variant: "destructive",
      });
      return;
    }
    setCancelTarget(b);
  };

  const confirmCancel = () => {
    if (!cancelTarget) return;
    cancelBooking(cancelTarget.id);
    toast({
      title: "Appointment cancelled",
      description: `${cancelTarget.service} on ${format(cancelTarget.date, "MMM d, h:mm a")} has been cancelled.`,
    });
    setCancelTarget(null);
  };

  // Timeline steps for the appointment-detail view
  const getTimelineSteps = (b: Booking) => {
    const isCancelled = b.status === "Cancelled";
    const isCompleted = b.status === "Completed";
    const appointmentPassed = !isAfter(b.date, now) || isCompleted;
    const isConfirmed = b.status !== "Pending";

    return [
      {
        label: "Booking Placed",
        detail: format(b.createdAt, "MMM d, yyyy 'at' h:mm a"),
        done: true,
      },
      {
        label: isCancelled ? "Cancelled" : "Confirmed",
        detail: isCancelled
          ? "This appointment was cancelled"
          : isConfirmed
          ? "Your barber has confirmed this slot"
          : "Waiting for confirmation",
        done: isCancelled || isConfirmed,
        isCancelledStep: isCancelled,
      },
      {
        label: "Appointment",
        detail: `${format(b.date, "MMM d, yyyy")} at ${format(b.date, "h:mm a")} · ${b.duration}`,
        done: !isCancelled && appointmentPassed,
        skipped: isCancelled,
      },
      {
        label: "Completed",
        detail: isCompleted ? "Hope you loved the results!" : isCancelled ? "N/A" : "Pending your visit",
        done: isCompleted,
        skipped: isCancelled,
      },
    ];
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <div className="bg-background/95 backdrop-blur-md border-b border-primary/15 px-4 py-3 sticky top-0 z-30">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 gradient-gold rounded-lg flex items-center justify-center rotate-[-6deg] shadow-lg shadow-black/30">
              <Scissors className="w-4.5 h-4.5 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <span className="font-heading text-lg font-bold tracking-wide block">Glam Aura</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-primary/80">Men's Grooming Lounge</span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 gradient-gold rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold ring-2 ring-primary/30">
              {user?.name?.charAt(0).toUpperCase() || "J"}
            </div>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-primary transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="font-heading text-2xl font-bold">Welcome back, {user?.name || "Guest"}</h1>
        </div>
        <p className="text-muted-foreground text-sm mb-8">
          Track your grooming sessions and manage your appointments.
        </p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? "gradient-gold text-primary-foreground shadow-lg shadow-black/20"
                  : "bg-card border border-primary/15 text-muted-foreground hover:text-primary hover:border-primary/30"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* Bookings */}
        {tab === "bookings" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3 bg-primary/8 border border-primary/25 rounded-xl px-4 py-3 text-sm text-primary flex-1 min-w-[240px]">
                <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Cancellation policy: appointments can be cancelled up to{" "}
                  <span className="font-semibold">1 hour</span> before the scheduled time. After that, the booking is locked.
                </span>
              </div>
              <Link
                to="/quickbooking"
                className="flex items-center gap-2 gradient-gold text-primary-foreground font-semibold px-5 py-3 rounded-xl shadow-lg shadow-black/20 hover:opacity-90 transition-opacity shrink-0"
              >
                <CalendarPlus className="w-4 h-4" /> Book Appointment
              </Link>
            </div>

            {sortedBookings.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-primary/30" />
                <p className="mb-4">No appointments yet. Book your first grooming session!</p>
                <Link to="/quickbooking" className="btn-gold inline-flex items-center gap-2">
                  <CalendarPlus className="w-4 h-4" /> Book Appointment
                </Link>
              </div>
            )}

            {sortedBookings.map((b) => {
              const { locked, isActiveStatus } = getLockInfo(b);
              const showCancelBtn = isActiveStatus;
              return (
                <div
                  key={b.id}
                  className="bg-card rounded-xl border border-primary/15 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                      <Scissors className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{b.service}</h3>
                      <p className="text-sm text-muted-foreground">
                        {b.barber} · ${b.price}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {format(b.date, "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {format(b.date, "h:mm a")}
                        </span>
                        {b.branch && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {b.branch}
                          </span>
                        )}
                        {isActiveStatus && (
                          <span className="flex items-center gap-1 text-primary">
                            <Timer className="w-3 h-3" /> {countdownLabel(b)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${statusStyles[b.status]}`}>
                      {statusIcons[b.status]} {b.status}
                    </span>
                    <button
                      onClick={() => setDetailTarget(b)}
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Eye className="w-3 h-3" /> Details
                    </button>
                    {showCancelBtn && (
                      <button
                        onClick={() => requestCancel(b)}
                        disabled={locked}
                        className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                          locked
                            ? "border-border text-muted-foreground/70 cursor-not-allowed"
                            : "border-red-500/30 text-red-400 hover:bg-red-500/10"
                        }`}
                      >
                        {locked ? <Lock className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                        {locked ? "Locked" : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Profile */}
        {tab === "profile" && (
          <div className="bg-card rounded-2xl border border-primary/15 p-8 max-w-lg">
            <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-primary" /> Edit Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block text-muted-foreground">Full Name</label>
                <input
                  defaultValue={user?.name || ""}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-muted-foreground">Email</label>
                <input
                  defaultValue={user?.email || ""}
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block text-muted-foreground">Phone</label>
                <input
                  defaultValue="+91 xxxx-xxxx"
                  className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <button className="btn-gold">Save Changes</button>
            </div>
          </div>
        )}

        {/* Favorites */}
        {tab === "favorites" && (
          <div className="text-center py-16">
            <Heart className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No favorite barbers yet. Start exploring!</p>
            <Link to="/salons" className="btn-gold inline-block mt-4">
              Browse Barbershops
            </Link>
          </div>
        )}
      </div>

      {/* Cancel confirmation dialog */}
      <AlertDialog open={!!cancelTarget} onOpenChange={(open) => !open && setCancelTarget(null)}>
        <AlertDialogContent className="bg-card border border-primary/20 text-foreground">
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {cancelTarget && (
                <>
                  You're about to cancel <span className="text-primary">{cancelTarget.service}</span> on{" "}
                  {format(cancelTarget.date, "MMM d, h:mm a")}. This action can't be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-primary/20 text-foreground hover:bg-background">
              Keep Appointment
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel} className="bg-red-500 hover:bg-red-600 text-white">
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Appointment detail + timeline dialog */}
      <Dialog open={!!detailTarget} onOpenChange={(open) => !open && setDetailTarget(null)}>
        <DialogContent className="bg-card border border-primary/20 text-foreground max-w-lg">
          {detailTarget && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-primary" /> {detailTarget.service}
                </DialogTitle>
              </DialogHeader>

              {/* Key details */}
              <div className="grid grid-cols-2 gap-3 text-sm mb-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="w-3.5 h-3.5 text-primary" /> {detailTarget.barber}
                </div>
                {detailTarget.branch && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary" /> {detailTarget.branch}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5 text-primary" /> {format(detailTarget.date, "MMM d, yyyy")}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5 text-primary" /> {format(detailTarget.date, "h:mm a")} · {detailTarget.duration}
                </div>
                {detailTarget.customerPhone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5 text-primary" /> {detailTarget.customerPhone}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-primary font-semibold">${detailTarget.price}</span>
                </div>
                {detailTarget.couponCode && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Tag className="w-3.5 h-3.5 text-primary" /> {detailTarget.couponCode} applied (-₹{detailTarget.discountAmount})
                  </div>
                )}
              </div>

              <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full w-fit mb-4 ${statusStyles[detailTarget.status]}`}>
                {statusIcons[detailTarget.status]} {detailTarget.status}
              </span>

              {/* Timeline */}
              <div className="border-t border-primary/15 pt-4">
                <h4 className="text-sm font-semibold mb-4 text-foreground">Appointment Timeline</h4>
                <div className="space-y-0">
                  {getTimelineSteps(detailTarget).map((step, i, arr) => (
                    <div key={step.label} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                            step.isCancelledStep
                              ? "bg-red-500/20 text-red-400"
                              : step.done
                              ? "bg-primary text-primary-foreground"
                              : step.skipped
                              ? "bg-muted text-muted-foreground/70"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {step.isCancelledStep ? (
                            <XCircle className="w-3.5 h-3.5" />
                          ) : step.done ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <CircleDot className="w-3 h-3" />
                          )}
                        </div>
                        {i < arr.length - 1 && (
                          <div
                            className={`w-px flex-1 min-h-[28px] ${
                              step.done && !step.isCancelledStep ? "bg-primary/50" : "bg-border"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className={`text-sm font-medium ${step.skipped ? "text-muted-foreground/70" : "text-foreground"}`}>
                          {step.label}
                        </p>
                        <p className="text-xs text-muted-foreground">{step.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDashboard;
