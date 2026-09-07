import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  Trophy,
  ShoppingBag,
  Package,
  Trash2,
  ShoppingCart,
  LayoutGrid,
  Star,
  ArrowRight,
  Gift,
  Percent,
  Bell,
  Flame,
  BellRing,
  BadgeCheck,
  Wallet,
  CalendarDays,
  Settings,
  MessageSquare,
  Sparkle,
  CheckCheck,
} from "lucide-react";
import { differenceInMinutes, format, isAfter } from "date-fns";
import { services as allServices } from "@/data/mockData";
import { ChatWidget } from "@/components/ChatWidget";
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
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useBookings, Booking, BookingStatus } from "@/context/BookingsContext";
import { useCart } from "@/context/CartContext";

const CANCEL_WINDOW_MINUTES = 60;

const statusStyles: Record<BookingStatus, string> = {
  Confirmed: "bg-primary/15 text-primary border border-primary/30",
  Pending: "bg-primary/10 text-primary border border-primary/30",
  Completed: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
  Cancelled: "bg-red-500/10 text-red-400 border border-red-500/30",
};

const statusIcons: Record<BookingStatus, JSX.Element> = {
  Confirmed: <ShieldCheck className="w-3 h-3" />,
  Pending: <Loader2 className="w-3 h-3" />,
  Completed: <CheckCircle2 className="w-3 h-3" />,
  Cancelled: <XCircle className="w-3 h-3" />,
};

type Tab = "overview" | "bookings" | "wishlist" | "orders" | "notifications" | "profile";

const ClientDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab: Tab = (["overview", "bookings", "wishlist", "orders", "notifications", "profile"] as Tab[]).includes(
    searchParams.get("tab") as Tab
  )
    ? (searchParams.get("tab") as Tab)
    : "overview";
  const [tab, setTab] = useState<Tab>(initialTab);
  const { bookings, cancelBooking } = useBookings();
  const { wishlistItems, orders, addToCart, removeFromWishlist } = useCart();
  const [now, setNow] = useState(new Date());
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [detailTarget, setDetailTarget] = useState<Booking | null>(null);
  const { toast } = useToast();
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [profileName, setProfileName] = useState(user?.name || "");
  const [profileEmail, setProfileEmail] = useState(user?.email || "");
  const [profilePhone, setProfilePhone] = useState(user?.phone || "");
  const [readNotifIds, setReadNotifIds] = useState<Set<string>>(new Set());
  const [notifPrefs, setNotifPrefs] = useState({ reminders: true, offers: true, orderUpdates: true });

  useEffect(() => {
    setProfileName(user?.name || "");
    setProfileEmail(user?.email || "");
    setProfilePhone(user?.phone || "");
  }, [user]);

  const handleTabChange = (next: Tab) => {
    setTab(next);
    setSearchParams(next === "overview" ? {} : { tab: next });
  };

  const handleSaveProfile = async () => {
    const result = await updateProfile({ name: profileName, email: profileEmail, phone: profilePhone });
    if (result.success) {
      toast({ title: "Profile updated", description: "Your changes have been saved." });
    } else {
      toast({ title: "Couldn't save profile", description: result.error, variant: "destructive" });
    }
  };

  const handleMoveToCart = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart(item);
    removeFromWishlist(item.id);
    toast({ title: "Added to cart", description: `${item.name} moved to your cart.` });
  };

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
    { id: "overview" as const, label: "Overview", icon: LayoutGrid },
    { id: "bookings" as const, label: "My Appointments", icon: Calendar },
    { id: "wishlist" as const, label: "Wishlist", icon: Heart },
    { id: "orders" as const, label: "Orders", icon: Package },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  // Most recently booked appointments shown first
  const sortedBookings = [...bookings].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const upcomingCount = sortedBookings.filter(
    (b) => (b.status === "Confirmed" || b.status === "Pending") && isAfter(b.date, now)
  ).length;
  const completedCount = sortedBookings.filter((b) => b.status === "Completed").length;
  const loyaltyPoints = completedCount * 50 + orders.length * 20;

  // ---- Overview tab helpers ----
  const greeting = (() => {
    const h = now.getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const nextAppointment = sortedBookings
    .filter((b) => (b.status === "Confirmed" || b.status === "Pending") && isAfter(b.date, now))
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  const LOYALTY_TIER_SIZE = 500;
  const loyaltyTier = Math.floor(loyaltyPoints / LOYALTY_TIER_SIZE) + 1;
  const loyaltyIntoTier = loyaltyPoints % LOYALTY_TIER_SIZE;
  const loyaltyProgressPct = Math.min(100, Math.round((loyaltyIntoTier / LOYALTY_TIER_SIZE) * 100));
  const pointsToNextReward = LOYALTY_TIER_SIZE - loyaltyIntoTier;

  const recommendedServices = [...allServices]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 3);

  // ---- Account stats for Profile tab ----
  const totalSpentOnBookings = sortedBookings
    .filter((b) => b.status !== "Cancelled")
    .reduce((sum, b) => sum + b.price, 0);
  const totalSpentOnOrders = orders.reduce((sum, o) => sum + o.total, 0);
  const totalSpent = totalSpentOnBookings + totalSpentOnOrders;
  const memberSince = sortedBookings.length
    ? format(sortedBookings[sortedBookings.length - 1].createdAt, "MMM yyyy")
    : format(now, "MMM yyyy");

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

  // ---- Notifications feed (derived from live booking/order/account state) ----
  type NotifItem = {
    id: string;
    type: "reminder" | "order" | "offer" | "account";
    icon: JSX.Element;
    title: string;
    description: string;
    time: Date;
  };

  const notifications: NotifItem[] = [
    ...sortedBookings
      .filter((b) => (b.status === "Confirmed" || b.status === "Pending") && isAfter(b.date, now))
      .map((b) => ({
        id: `remind-${b.id}`,
        type: "reminder" as const,
        icon: <CalendarDays className="w-4 h-4 text-primary" />,
        title: `Upcoming: ${b.service}`,
        description: `${countdownLabel(b)} with ${b.barber}${b.branch ? ` at ${b.branch}` : ""}.`,
        time: b.date,
      })),
    ...orders.slice(0, 5).map((o) => ({
      id: `order-${o.id}`,
      type: "order" as const,
      icon: <Package className="w-4 h-4 text-primary" />,
      title: `Order ${o.status === "Delivered" ? "delivered" : "is processing"}`,
      description: `${o.id} · ${o.items.length} item${o.items.length > 1 ? "s" : ""} · ₹${o.total}`,
      time: o.date,
    })),
    ...(sortedBookings.some((b) => b.status === "Cancelled")
      ? [
          {
            id: "cancel-info",
            type: "account" as const,
            icon: <XCircle className="w-4 h-4 text-primary" />,
            title: "An appointment was cancelled",
            description: "Check My Appointments to rebook a slot that suits you.",
            time: now,
          },
        ]
      : []),
    // {
    //   id: "promo-hairspa",
    //   type: "offer" as const,
    //   icon: <Percent className="w-4 h-4 text-primary" />,
    //   title: "20% off Hair Spa this week",
    //   description: "Book any hair spa session before Sunday and save instantly.",
    //   time: now,
    // },
    // {
    //   id: "promo-referral",
    //   type: "offer" as const,
    //   icon: <Gift className="w-4 h-4 text-primary" />,
    //   title: "Refer a friend, earn 100 points",
    //   description: "Share Glam Aura with a friend — you both get rewarded on their first visit.",
    //   time: now,
    // },
    {
      id: "welcome",
      type: "account" as const,
      icon: <Sparkle className="w-4 h-4 text-primary" />,
      title: `Welcome to Glam Aura, ${user?.name || "there"}!`,
      description: "Complete your profile and book your first session to start earning loyalty points.",
      time: now,
    },
  ].sort((a, b) => b.time.getTime() - a.time.getTime());

  const unreadNotifCount = notifications.filter((n) => !readNotifIds.has(n.id)).length;

  const markNotifRead = (id: string) => {
    setReadNotifIds((prev) => new Set(prev).add(id));
  };

  const markAllNotifsRead = () => {
    setReadNotifIds(new Set(notifications.map((n) => n.id)));
  };

  const notifTypeBadge: Record<NotifItem["type"], string> = {
    reminder: "bg-primary/10 text-primary border-primary/30",
    order: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    offer: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    account: "bg-primary/10 text-primary border-primary/30",
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
            <button
              onClick={() => handleTabChange("notifications")}
              className="relative text-muted-foreground hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
              {unreadNotifCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifCount > 9 ? "9+" : unreadNotifCount}
                </span>
              )}
            </button>
            <div className="w-9 h-9 gradient-gold rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold ring-2 ring-primary/30">
              {user?.name?.charAt(0).toUpperCase() || "J"}
            </div>
            <button onClick={handleLogout} className="text-muted-foreground hover:text-primary transition-colors" aria-label="Log out">
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

        {/* Overview stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-primary/15 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{upcomingCount}</p>
              <p className="text-xs text-muted-foreground">Upcoming Bookings</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-primary/15 p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Total Visits</p>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-primary/15 p-5 flex items-center gap-4 col-span-2 md:col-span-1">
            <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground">{loyaltyPoints}</p>
              <p className="text-xs text-muted-foreground">Loyalty Points</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTabChange(t.id)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? "gradient-gold text-primary-foreground shadow-lg shadow-black/20"
                  : "bg-card border border-primary/15 text-muted-foreground hover:text-primary hover:border-primary/30"
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
              {t.id === "notifications" && unreadNotifCount > 0 && (
                <span
                  className={`ml-0.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    tab === t.id ? "bg-primary-foreground/20 text-primary-foreground" : "bg-primary text-primary-foreground"
                  }`}
                >
                  {unreadNotifCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6">
            {/* Welcome banner */}
            <div className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/15 via-card to-card p-6 sm:p-8">
              <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-primary/20 blur-3xl" />
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-primary/80 font-semibold mb-1">
                    {greeting}
                  </p>
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                    {user?.name || "Guest"}, ready to look sharp?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {upcomingCount > 0
                      ? `You have ${upcomingCount} upcoming booking${upcomingCount > 1 ? "s" : ""}.`
                      : "You have no upcoming bookings — treat yourself to a session."}
                  </p>
                </div>
                <Link
                  to="/quickbooking"
                  className="flex items-center justify-center gap-2 gradient-gold text-primary-foreground font-semibold px-5 py-3 rounded-xl shadow-lg shadow-black/20 hover:opacity-90 transition-opacity shrink-0 whitespace-nowrap btn-shine btn-glow"
                >
                  <CalendarPlus className="w-4 h-4" /> Book Appointment
                </Link>
              </div>
            </div>

            {/* Next appointment highlight */}
            {nextAppointment ? (
              <div className="bg-card rounded-2xl border border-primary/20 p-5 sm:p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Bell className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">Your Next Appointment</h3>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                      <Scissors className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{nextAppointment.service}</h4>
                      <p className="text-sm text-muted-foreground">{nextAppointment.barber}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {format(nextAppointment.date, "MMM d, yyyy")}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {format(nextAppointment.date, "h:mm a")}
                        </span>
                        <span className="flex items-center gap-1 text-primary">
                          <Timer className="w-3 h-3" /> {countdownLabel(nextAppointment)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setDetailTarget(nextAppointment)}
                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-2.5 rounded-xl border border-primary/20 text-primary hover:bg-primary/10 transition-colors self-start sm:self-center whitespace-nowrap btn-icon-pop"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-dashed border-primary/25 p-6 text-center">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-primary/40" />
                <p className="text-sm text-muted-foreground mb-3">No upcoming appointments scheduled.</p>
                <Link to="/quickbooking" className="btn-gold btn-depth inline-flex items-center gap-2 text-sm">
                  <CalendarPlus className="w-3.5 h-3.5" /> Book Your Next Session
                </Link>
              </div>
            )}

            {/* Quick actions */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Book Appointment", icon: CalendarPlus, to: "/quickbooking" },
                  { label: "Shop Products", icon: ShoppingBag, to: "/products" },
                  { label: "My Wishlist", icon: Heart, action: () => handleTabChange("wishlist") },
                  { label: "Track Orders", icon: Package, action: () => handleTabChange("orders") },
                ].map((item) => (
                  item.to ? (
                    <Link
                      key={item.label}
                      to={item.to}
                      className="flex flex-col items-center justify-center gap-2 bg-card border border-primary/15 rounded-xl p-4 text-center hover:border-primary/40 transition-all btn-bounce"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center">
                        <item.icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-foreground">{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="flex flex-col items-center justify-center gap-2 bg-card border border-primary/15 rounded-xl p-4 text-center hover:border-primary/40 transition-all btn-bounce"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center">
                        <item.icon className="w-4.5 h-4.5 text-primary" />
                      </div>
                      <span className="text-xs font-medium text-foreground">{item.label}</span>
                    </button>
                  )
                ))}
              </div>
            </div>

            {/* Loyalty progress */}
            <div className="bg-card rounded-2xl border border-primary/15 p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Loyalty Tier {loyaltyTier}</h3>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                  <Gift className="w-3 h-3" /> {pointsToNextReward} pts to next reward
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-primary/10 overflow-hidden">
                <div
                  className="h-full gradient-gold rounded-full transition-all"
                  style={{ width: `${loyaltyProgressPct}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {loyaltyPoints} points earned · Every {LOYALTY_TIER_SIZE} points unlocks a free grooming perk.
              </p>
            </div>

            {/* Recommended for you */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-primary" /> Recommended For You
                </h3>
                <Link to="/salons" className="text-xs font-medium text-primary flex items-center gap-1 hover:underline">
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                {recommendedServices.map((s) => (
                  <Link
                    key={s.id}
                    to={`/service/${s.id}`}
                    className="group bg-card rounded-xl border border-primary/15 overflow-hidden hover:border-primary/40 hover:-translate-y-0.5 transition-all"
                  >
                    <div className="h-28 overflow-hidden">
                      <img
                        src={s.image}
                        alt={s.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-sm text-foreground truncate">{s.name}</h4>
                        {s.rating && (
                          <span className="flex items-center gap-1 text-xs text-primary shrink-0">
                            <Star className="w-3 h-3 fill-primary" /> {s.rating}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-primary font-bold text-sm">₹{s.price}</span>
                        {s.originalPrice && (
                          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
                            <Percent className="w-2.5 h-2.5" /> Save ₹{s.originalPrice - s.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {tab === "notifications" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
              <p className="text-sm text-muted-foreground">
                {unreadNotifCount > 0 ? `${unreadNotifCount} unread notification${unreadNotifCount > 1 ? "s" : ""}` : "You're all caught up."}
              </p>
              {unreadNotifCount > 0 && (
                <button
                  onClick={markAllNotifsRead}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-primary/20 text-primary hover:bg-primary/10 transition-colors btn-elastic"
                >
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <BellRing className="w-12 h-12 mx-auto mb-4 text-primary/30" />
                <p>No notifications yet.</p>
              </div>
            )}

            {notifications.map((n) => {
              const isRead = readNotifIds.has(n.id);
              return (
                <button
                  key={n.id}
                  onClick={() => markNotifRead(n.id)}
                  className={`w-full text-left bg-card rounded-xl border p-4 flex items-start gap-4 transition-colors ${
                    isRead ? "border-primary/10 opacity-70" : "border-primary/25"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                    {n.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-foreground">{n.title}</h4>
                      <span className={`text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full border ${notifTypeBadge[n.type]}`}>
                        {n.type}
                      </span>
                      {!isRead && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{n.description}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{format(n.time, "MMM d, yyyy · h:mm a")}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

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
                <Link to="/quickbooking" className="btn-gold btn-border-draw inline-flex items-center gap-2">
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
                      className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-primary/20 text-primary hover:bg-primary/10 transition-colors btn-tilt"
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
                            : "border-red-500/30 text-red-400 hover:bg-red-500/10 btn-wobble"
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
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Edit form */}
            <div className="bg-card rounded-2xl border border-primary/15 p-8 lg:col-span-3">
              <h2 className="font-heading text-xl font-semibold mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" /> Edit Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block text-muted-foreground">Full Name</label>
                  <input
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-muted-foreground">Email</label>
                  <input
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block text-muted-foreground">Phone</label>
                  <input
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 xxxx-xxxx"
                    className="w-full px-4 py-3 rounded-xl border border-primary/20 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                </div>
                <button onClick={handleSaveProfile} className="btn-gold btn-color-sweep">Save Changes</button>
              </div>

              {/* Notification preferences */}
              <div className="mt-8 pt-6 border-t border-primary/15">
                <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" /> Notification Preferences
                </h3>
                <div className="space-y-3">
                  {[
                    { key: "reminders" as const, label: "Appointment reminders", icon: CalendarDays },
                    { key: "offers" as const, label: "Offers & promotions", icon: Percent },
                    { key: "orderUpdates" as const, label: "Order status updates", icon: Package },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-sm text-muted-foreground">
                        <pref.icon className="w-4 h-4 text-primary/70" /> {pref.label}
                      </span>
                      <Switch
                        checked={notifPrefs[pref.key]}
                        onCheckedChange={(checked) =>
                          setNotifPrefs((prev) => ({ ...prev, [pref.key]: checked }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Account summary sidebar */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-card rounded-2xl border border-primary/15 p-6 text-center">
                <div className="w-16 h-16 mx-auto gradient-gold rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold ring-4 ring-primary/20 mb-3">
                  {user?.name?.charAt(0).toUpperCase() || "J"}
                </div>
                <h3 className="font-heading font-semibold text-foreground">{user?.name || "Guest"}</h3>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <span className="inline-flex items-center gap-1.5 mt-3 text-[11px] font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/30">
                  <BadgeCheck className="w-3 h-3" /> Member since {memberSince}
                </span>
              </div>

              <div className="bg-card rounded-2xl border border-primary/15 p-6">
                <h3 className="text-sm font-semibold text-foreground mb-4">Account Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-3.5 h-3.5 text-primary/70" /> Total Bookings
                    </span>
                    <span className="font-semibold text-foreground">{sortedBookings.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <ShoppingBag className="w-3.5 h-3.5 text-primary/70" /> Product Orders
                    </span>
                    <span className="font-semibold text-foreground">{orders.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Wallet className="w-3.5 h-3.5 text-primary/70" /> Total Spent
                    </span>
                    <span className="font-semibold text-primary">₹{totalSpent}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="w-3.5 h-3.5 text-primary/70" /> Loyalty Points
                    </span>
                    <span className="font-semibold text-foreground">{loyaltyPoints}</span>
                  </div>
                </div>
              </div>

              <Link
                to="/contact"
                className="flex items-center justify-center gap-2 bg-card border border-primary/15 rounded-2xl p-4 text-sm font-medium text-primary hover:border-primary/40 transition-colors"
              >
                <MessageSquare className="w-4 h-4" /> Need help? Contact support
              </Link>
            </div>
          </div>
        )}

        {/* Wishlist */}
        {tab === "wishlist" && (
          <div className="space-y-4">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16">
                <Heart className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No saved products yet. Tap the heart icon on any product to save it here.</p>
                <Link to="/products" className="btn-gold btn-slide-fill inline-block">
                  Browse Products
                </Link>
              </div>
            ) : (
              wishlistItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-card rounded-xl border border-primary/15 p-4 flex items-center gap-4"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                    <p className="text-primary font-bold mt-1">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => handleMoveToCart(item)}
                    className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Move to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No orders yet. Your product purchases will show up here.</p>
                <Link to="/products" className="btn-gold btn-tilt inline-block">
                  Shop Products
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-card rounded-xl border border-primary/15 p-5">
                  <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{order.id}</p>
                        <p className="text-xs text-muted-foreground">{format(order.date, "MMM d, yyyy 'at' h:mm a")}</p>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
                        order.status === "Delivered"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                          : "bg-primary/10 text-primary border border-primary/30"
                      }`}
                    >
                      {order.status === "Delivered" ? <CheckCircle2 className="w-3 h-3" /> : <Loader2 className="w-3 h-3" />}
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 text-sm">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-md object-cover shrink-0" />
                        <span className="flex-1 text-foreground truncate">{item.name}</span>
                        <span className="text-muted-foreground">x{item.quantity}</span>
                        <span className="text-primary font-medium">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between border-t border-primary/15 pt-3">
                    <span className="text-sm font-medium text-muted-foreground">Total</span>
                    <span className="font-bold text-primary">₹{order.total}</span>
                  </div>
                </div>
              ))
            )}
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

      <ChatWidget />
    </div>
  );
};

export default ClientDashboard;
