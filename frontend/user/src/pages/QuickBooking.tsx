import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import {
  Scissors, 
  User, 
  Calendar, 
  Clock, 
  CreditCard, 
  MessageSquare,
  Check,
  ChevronDown,
  Sparkles,
  MapPin,
  LogIn,
  Tag,
  X
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBookings } from "@/context/BookingsContext";
import { useToast } from "@/hooks/use-toast";
import PhoneInput from "@/components/PhoneInput";
import BookingSuccessModal from "@/components/BookingSuccessModal";
import { EarliestAcrossBranches } from "@/components/EarliestAcrossBranches";
import { isValidIndianPhone } from "@/lib/validators";
import {
  ApiError,
  checkAvailability,
  createBooking,
  fetchBarbers,
  fetchBranches,
  fetchServices,
  type ApiBarber,
  type ApiBranch,
  type ApiService,
} from "@/lib/bookingApi";
import { fetchPublicOffers, validateOfferCode, type ApiOffer } from "@/lib/offersApi";

const todayISO = () => new Date().toISOString().split("T")[0];

// True once the given time slot, on the given date, is already in the past.
const isSlotInPast = (dateStr: string, timeSlot: string): boolean => {
  if (!dateStr) return false;

  const today = todayISO();
  if (dateStr < today) return true;
  if (dateStr !== today) return false;

  const [time, modifier] = timeSlot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  const slotTime = new Date();
  slotTime.setHours(hours, minutes, 0, 0);
  return slotTime < new Date();
};

// Converts this page's 12-hour display format ("9:00 AM") into the 24-hour
// "HH:mm" format the backend's availability/booking endpoints expect.
const to24Hour = (timeSlot: string): string => {
  const [time, modifier] = timeSlot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

// Reverse of to24Hour - converts the backend's "HH:mm" into this page's
// "9:00 AM" display format. Note: this only lines up with an actual entry
// in the hardcoded `timeSlots` picker below if the salon's configured open
// hours/slot duration produce the same 30-minute grid that array assumes -
// true for the default settings, but worth knowing if hours are customized.
const from24Hour = (time24: string): string => {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

const QuickBooking = () => {
  const { isAuthenticated } = useAuth();
  const { addBooking } = useBookings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { id: serviceIdParam } = useParams();
  const { toast } = useToast();

  // Real branches/services fetched from the backend. Falls back to the
  // hardcoded arrays below if the API is unreachable, so this page still
  // works for local UI development without a backend running - same
  // mock-fallback pattern used in the superadmin app.
  const [apiServices, setApiServices] = useState<ApiService[] | null>(null);
  const [apiBranches, setApiBranches] = useState<(ApiBranch & { barbers: ApiBarber[] })[] | null>(null);
  const [catalogLoadFailed, setCatalogLoadFailed] = useState(false);
  // Real, superadmin-approved offers fetched from the backend. This is the
  // only source of truth for coupons here - no hardcoded fallback list, so
  // an offer only ever appears once it's actually approved and live.
  const [apiOffers, setApiOffers] = useState<ApiOffer[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const [realServices, realBranches] = await Promise.all([fetchServices(), fetchBranches()]);
        const branchesWithBarbers = await Promise.all(
          realBranches.map(async (b) => ({ ...b, barbers: await fetchBarbers(b.id) }))
        );
        if (!cancelled) {
          setApiServices(realServices);
          setApiBranches(branchesWithBarbers);
        }
      } catch {
        if (!cancelled) setCatalogLoadFailed(true);
      }
    })();

    fetchPublicOffers()
      .then((list) => {
        if (!cancelled) setApiOffers(list);
      })
      .catch(() => {
        /* Coupon browsing is a nice-to-have; a failed fetch just means no
           quick-pick chips are shown. Manually entered codes still get
           validated against the backend when applied. */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Service data with prices
  const mockBaseServices = [
    { id: 1, name: "Haircut", price: 499, duration: "30 min", icon: "✂️", category: "Hair" },
    { id: 4, name: "Hair Styling", price: 599, duration: "35 min", icon: "💇", category: "Hair" },
    { id: 2, name: "Beard Trim", price: 299, duration: "20 min", icon: "🧔", category: "Grooming" },
    { id: 5, name: "Facial", price: 899, duration: "50 min", icon: "🧖", category: "Spa" },
    { id: 6, name: "Head Massage", price: 399, duration: "25 min", icon: "💆", category: "Spa" },
    { id: 3, name: "Haircut + Beard Combo", price: 749, duration: "45 min", icon: "✨", category: "Combo" },
  ];

  // Prefer real backend data; fall back to the mock list above only if the
  // API call failed (backend unreachable). Category defaults to "Combo" for
  // any real service whose category doesn't match one of the four buckets
  // this page groups by.
  const baseServices = apiServices
    ? apiServices.map((s) => ({
        id: s.id,
        name: s.name,
        price: s.price,
        duration: `${s.durationMinutes} min`,
        icon: "✨",
        category: (["Hair", "Grooming", "Spa", "Combo"].includes(s.category ?? "") ? s.category : "Combo") as string,
      }))
    : mockBaseServices;

  // If we arrived here via a "Book Now" link from the Services page
  // (/book/:id), make sure that exact service is selectable and preselected,
  // even if it isn't one of the six quick-pick defaults above. Looked up
  // from the real backend catalog (apiServices), not a hardcoded list, so
  // this works for any real service id rather than only the mock ones.
  const linkedApiService = serviceIdParam
    ? apiServices?.find((s) => String(s.id) === String(serviceIdParam))
    : undefined;

  const services = linkedApiService
    ? [
        {
          id: linkedApiService.id,
          name: linkedApiService.name,
          price: linkedApiService.price,
          duration: `${linkedApiService.durationMinutes} min`,
          icon: "✨",
          category: (["Hair", "Grooming", "Spa", "Combo"].includes(linkedApiService.category ?? "")
            ? linkedApiService.category
            : "Combo") as string,
        },
        ...baseServices.filter((s) => s.id !== linkedApiService.id),
      ]
    : baseServices;

  // Group services by category, in a fixed display order, for the "Choose Services" grid
  const serviceCategoryOrder = ["Hair", "Grooming", "Spa", "Combo"];
  const servicesByCategory = serviceCategoryOrder
    .map((cat) => ({ cat, items: services.filter((s) => s.category === cat) }))
    .filter((group) => group.items.length > 0);

  // Which part of the day a time slot falls into, for grouping under Morning/Afternoon/Evening
  const getSlotPeriod = (timeSlot: string): "Morning" | "Afternoon" | "Evening" => {
    const [time, modifier] = timeSlot.split(" ");
    const hours = Number(time.split(":")[0]);
    if (modifier === "AM") return "Morning";
    if (hours === 12 || hours < 5) return "Afternoon";
    return "Evening";
  };

  // Nagpur branches, each with its own barbers (fallback if the API is unreachable)
  const mockBranches = [
    {
      id: "shankar-nagar",
      name: "Shankar Nagar",
      barbers: [
        { id: "rahul", name: "Rahul", specialty: "Senior Barber", available: true },
        { id: "amit", name: "Amit", specialty: "Hair Specialist", available: true },
        { id: "rohan", name: "Rohan", specialty: "Beard Expert", available: true },
      ],
    },
    {
      id: "hingna",
      name: "Hingna",
      barbers: [
        { id: "tejas", name: "Tejas", specialty: "Senior Barber", available: true },
        { id: "kunal", name: "Kunal", specialty: "Hair Specialist", available: true },
        { id: "mohit", name: "Mohit", specialty: "Beard Expert", available: true },
      ],
    },
    {
      id: "sadar",
      name: "Sadar",
      barbers: [
        { id: "sahil", name: "Sahil", specialty: "Senior Barber", available: true },
        { id: "parth", name: "Parth", specialty: "Hair Specialist", available: true },
        { id: "ronak", name: "Ronak", specialty: "Beard Expert", available: true },
      ],
    },
    {
      id: "mahal-chowk",
      name: "Mahal Chowk",
      barbers: [
        { id: "vikram", name: "Vikram", specialty: "Senior Barber", available: true },
        { id: "aditya", name: "Aditya", specialty: "Hair Specialist", available: true },
        { id: "nikhil", name: "Nikhil", specialty: "Beard Expert", available: true },
      ],
    },
  ];

  const branches = apiBranches
    ? apiBranches.map((b) => ({
        id: b.id,
        name: b.name,
        barbers: b.barbers.map((barber) => ({
          id: barber.id,
          name: barber.name,
          specialty: barber.specialties?.[0] || "Barber",
          available: true,
        })),
      }))
    : mockBranches;

  // Time slots
  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
    "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM",
    "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM"
  ];

  // Extra services
  const extraServices = [
    { id: "wash", name: "Hair Wash", price: 50 },
    { id: "massage", name: "Head Massage", price: 100 },
    { id: "styling", name: "Hair Styling", price: 150 },
  ];

  // State management
  const [selectedService, setSelectedService] = useState(services[0]);
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);
  const barbersForBranch = [
    { id: "any", name: "Any Available Barber", specialty: "Best Match", available: true },
    ...selectedBranch.barbers,
  ];
  const [selectedBarber, setSelectedBarber] = useState(barbersForBranch[0]);
  const [selectedDate, setSelectedDate] = useState(todayISO);
  const [selectedTime, setSelectedTime] = useState(
    () => timeSlots.find((slot) => !isSlotInPast(todayISO(), slot)) || ""
  );
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [totalPrice, setTotalPrice] = useState(services[0].price);

  // Once real branches/services load from the backend (replacing the mock
  // defaults the state above was initialized with), re-point the current
  // selection at the equivalent real item so its `id` is a real UUID the
  // backend will recognize when the booking is actually submitted.
  useEffect(() => {
    if (apiServices && !apiServices.some((s) => String(s.id) === String(selectedService.id))) {
      setSelectedService(services[0]);
      setTotalPrice(services[0].price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiServices]);

  useEffect(() => {
    if (apiBranches && !apiBranches.some((b) => b.id === selectedBranch.id)) {
      const firstBranch = branches[0];
      setSelectedBranch(firstBranch);
      setSelectedBarber({ id: "any", name: "Any Available Barber", specialty: "Best Match", available: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBranches]);

  // How many of the branch's per-slot booking capacity remain open at each
  // time, for the selected branch/date/barber. Only queried once real
  // branch data is loaded (mock branch ids aren't real UUIDs the backend
  // would recognize). A time slot with 0 remaining gets disabled in the
  // picker below, just like a past time slot already was.
  const [remainingCapacityByTime, setRemainingCapacityByTime] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!apiBranches || !selectedBranch?.id || !selectedDate) {
      setRemainingCapacityByTime({});
      return;
    }
    let cancelled = false;
    const barberId = selectedBarber?.id && selectedBarber.id !== "any" ? selectedBarber.id : undefined;

    checkAvailability(selectedBranch.id, selectedDate, barberId)
      .then((availability) => {
        if (!cancelled) setRemainingCapacityByTime(availability.remainingCapacityByTime);
      })
      .catch(() => {
        if (!cancelled) setRemainingCapacityByTime({});
      });

    return () => {
      cancelled = true;
    };
  }, [apiBranches, selectedBranch?.id, selectedDate, selectedBarber?.id]);

  // Keep the selected service in sync if the :id in the URL changes
  // (e.g. navigating from one service's "Book Now" link to another's).
  useEffect(() => {
    if (linkedApiService) {
      setSelectedService(services[0]);
      setTotalPrice(services[0].price);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serviceIdParam]);
  const [bookingStep, setBookingStep] = useState(1); // 1: service selection, 2: customer info
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [confirmedDetails, setConfirmedDetails] = useState<{ name: string; service: string; when: string } | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState<ApiOffer | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Calculate total price whenever dependencies change
  useEffect(() => {
    const extrasTotal = selectedExtras.reduce((sum, extraId) => {
      const extra = extraServices.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    
    setTotalPrice(selectedService.price + extrasTotal);
  }, [selectedService, selectedExtras]);

  // Validate a coupon code against the live backend (the source of truth -
  // only superadmin-approved, active, unexpired offers will succeed here).
  const applyCoupon = async (rawCode: string) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const offer = await validateOfferCode(code);
      setAppliedOffer(offer);
      setCouponError("");
      setCouponInput(offer.code);
      toast({
        title: "Coupon applied!",
        description: `${offer.title} has been applied to your booking.`,
      });
    } catch (err) {
      setAppliedOffer(null);
      setCouponError(err instanceof Error ? err.message : "This coupon code isn't valid.");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedOffer(null);
    setCouponInput("");
    setCouponError("");
  };

  // Auto-apply a coupon code passed in via ?code=... (e.g. from "Claim Offer")
  useEffect(() => {
    const codeFromUrl = searchParams.get("code");
    if (codeFromUrl) {
      setCouponInput(codeFromUrl);
      applyCoupon(codeFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const discountAmount = appliedOffer
    ? appliedOffer.discountType === "PERCENTAGE"
      ? Math.round((totalPrice * appliedOffer.discountValue) / 100)
      : Math.min(appliedOffer.discountValue, totalPrice)
    : 0;
  const discountedTotal = Math.max(0, totalPrice - discountAmount);

  // Check if a time slot is in the past, for the currently selected date
  // (or an explicit dateOverride, used right when the date is changing).
  const isTimeSlotDisabled = (timeSlot, dateOverride = undefined) =>
    isSlotInPast(dateOverride ?? selectedDate, timeSlot) || remainingCapacityByTime[to24Hour(timeSlot)] === 0;

  // Handle branch change (resets barber selection to "Any Available" for the new branch)
  const handleBranchChange = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId) || branches[0];
    setSelectedBranch(branch);
    setSelectedBarber({ id: "any", name: "Any Available Barber", specialty: "Best Match", available: true });
  };

  // Applies a slot picked from the "earliest across branches" panel: jumps
  // straight to that branch/date/time with "Any Available" barber, rather
  // than making the customer re-navigate the pickers manually.
  const applyEarliestSlot = (slot: { branchId: string; branchName: string; date: string; time: string }) => {
    const branch = branches.find((b) => b.id === slot.branchId);
    if (branch) setSelectedBranch(branch);
    setSelectedBarber({ id: "any", name: "Any Available Barber", specialty: "Best Match", available: true });
    setSelectedDate(slot.date);
    setSelectedTime(from24Hour(slot.time));
  };

  // Handle extra service toggle
  const toggleExtra = (extraId) => {
    setSelectedExtras(prev =>
      prev.includes(extraId)
        ? prev.filter(id => id !== extraId)
        : [...prev, extraId]
    );
  };

  // Handle booking submission
  // Combine the selected date string and time slot into a real Date object
  const parseAppointmentDateTime = (dateStr: string, timeStr: string): Date => {
    const [time, modifier] = timeStr.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;
    const result = new Date(dateStr);
    result.setHours(hours, minutes, 0, 0);
    return result;
  };

  const handleBookAppointment = async () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: "/quickbooking" } });
      return;
    }
    if (!selectedService || !selectedBranch || !selectedBarber || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      setPhoneTouched(true);
      alert("Please fill in all required fields");
      return;
    }
    if (!isValidIndianPhone(customerPhone)) {
      setPhoneTouched(true);
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    const appointmentDate = parseAppointmentDateTime(selectedDate, selectedTime);

    // Only call the real backend once real branch/service data has loaded
    // (mock ids like "shankar-nagar" aren't UUIDs the backend recognizes).
    // This is where the actual 5-per-slot capacity limit gets enforced -
    // the backend rejects with 409 if the slot has just filled up, even
    // under concurrent requests, via a database-level lock.
    if (apiBranches && apiServices) {
      setIsSubmittingBooking(true);
      try {
        await createBooking({
          customerName,
          customerPhone: `+91${customerPhone}`,
          serviceId: String(selectedService.id),
          barberId: selectedBarber.id !== "any" ? String(selectedBarber.id) : undefined,
          branchId: String(selectedBranch.id),
          date: selectedDate,
          time: to24Hour(selectedTime),
          notes: specialInstructions || undefined,
          offerCode: appliedOffer?.code,
        });
      } catch (err) {
        setIsSubmittingBooking(false);
        if (err instanceof ApiError && err.status === 409) {
          toast({
            title: "Slot unavailable",
            description: "This time slot just reached its booking limit for this branch. Please pick another time.",
            variant: "destructive",
          });
          // Refresh remaining capacity so the picker reflects reality immediately.
          checkAvailability(selectedBranch.id, selectedDate, selectedBarber.id !== "any" ? selectedBarber.id : undefined)
            .then((a) => setRemainingCapacityByTime(a.remainingCapacityByTime))
            .catch(() => {});
        } else {
          toast({
            title: "Booking failed",
            description: err instanceof ApiError ? err.message : "Something went wrong. Please try again.",
            variant: "destructive",
          });
        }
        return;
      }
      setIsSubmittingBooking(false);
    }

    addBooking({
      service: selectedService.name,
      barber: selectedBarber.name,
      branch: selectedBranch.name,
      date: appointmentDate,
      duration: selectedService.duration,
      price: discountedTotal,
      customerName,
      customerPhone: `+91 ${customerPhone}`,
      ...(appliedOffer ? { couponCode: appliedOffer.code, discountAmount } : {}),
    });

    // Snapshot the details for the popup before the form resets below.
    setConfirmedDetails({
      name: customerName,
      service: selectedService.name,
      when: `${selectedDate} at ${selectedTime}`,
    });
    setIsBookingConfirmed(true);

    // Reset after a few seconds (long enough to enjoy the confetti) and
    // take the customer to their dashboard to track it.
    setTimeout(() => {
      setIsBookingConfirmed(false);
      setBookingStep(1);
      // Reset form
      setSelectedService(services[0]);
      setSelectedBranch(branches[0]);
      setSelectedBarber({ id: "any", name: "Any Available Barber", specialty: "Best Match", available: true });
      setSelectedDate("");
      setSelectedTime("");
      setSelectedExtras([]);
      setSpecialInstructions("");
      setCustomerName("");
      setCustomerPhone("");
      setPhoneTouched(false);
      removeCoupon();
      navigate("/dashboard");
    }, 3200);
  };

  const bookingSteps = [
    { step: 1, label: "Select Service", icon: Scissors },
    { step: 2, label: "Your Details", icon: User },
  ];

  return (
    <section className="relative py-16 px-4 bg-gradient-to-b from-background to-secondary/20 overflow-hidden">
      <BookingSuccessModal
        show={isBookingConfirmed}
        customerName={confirmedDetails?.name}
        serviceName={confirmedDetails?.service}
        dateLabel={confirmedDetails?.when}
      />
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-primary/20 blur-3xl animate-blob-a" />
        <div className="absolute -bottom-32 -right-16 w-[30rem] h-[30rem] rounded-full bg-[hsl(var(--gold-light))]/20 blur-3xl animate-blob-b" />
        <div className="absolute top-1/2 left-1/2 w-[22rem] h-[22rem] rounded-full bg-[hsl(var(--gold-dark))]/10 blur-3xl animate-blob-c" />
        {Array.from({ length: 14 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-primary/40 animate-sparkle"
            style={{
              left: `${(i * 137) % 100}%`,
              bottom: `-${(i * 23) % 40}px`,
              width: `${3 + (i % 3)}px`,
              height: `${3 + (i % 3)}px`,
              animationDuration: `${9 + (i % 6)}s`,
              animationDelay: `${(i % 7) * 1.3}s`,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-2 text-primary text-xs font-semibold tracking-[0.2em] uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Reserve Your Slot
          </span>
          <h2 className="section-heading mb-3">Book Your Appointment</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your service, select your preferred barber, and book in seconds
          </p>
        </motion.div>

        {/* Main Booking Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl shadow-xl border border-border overflow-hidden"
        >
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 md:gap-8 px-6 py-6 border-b border-border bg-secondary/10">
            {bookingSteps.map(({ step, label, icon: Icon }, idx) => (
              <div key={step} className="flex items-center gap-4">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all flex-shrink-0 ${
                      bookingStep >= step
                        ? "bg-primary border-primary text-primary-foreground"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    {bookingStep > step ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </span>
                  <span
                    className={`text-sm font-medium hidden sm:inline ${
                      bookingStep >= step ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {idx < bookingSteps.length - 1 && (
                  <span className={`w-10 md:w-24 h-px ${bookingStep > step ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {bookingStep === 1 ? (
              /* Step 1: Service Selection */
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Service Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-primary" />
                      Select Service <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedService.id}
                        onChange={(e) => {
                          // Compare as strings - real backend service ids
                          // are UUIDs, not numbers, unlike the mock catalog.
                          const service = services.find((s) => String(s.id) === e.target.value);
                          if (service) setSelectedService(service);
                        }}
                        className="w-full p-3 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                      >
                        {servicesByCategory.map(({ cat, items }) => (
                          <optgroup key={cat} label={cat}>
                            {items.map((service) => (
                              <option key={service.id} value={service.id}>
                                {service.name} – ₹{service.price}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                    {apiServices && <EarliestAcrossBranches serviceId={String(selectedService.id)} onPick={applyEarliestSlot} />}
                  </div>

                  {/* Branch Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Select Branch (Nagpur) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBranch.id}
                        onChange={(e) => handleBranchChange(e.target.value)}
                        className="w-full p-3 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                      >
                        {branches.map(branch => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Barber Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Select Barber <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={selectedBarber.id}
                      onChange={(e) => {
                        const barber = barbersForBranch.find((b) => b.id === e.target.value);
                        if (barber) setSelectedBarber(barber);
                      }}
                      className="w-full p-3 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                    >
                      {barbersForBranch.map((barber) => (
                        <option key={barber.id} value={barber.id} disabled={!barber.available}>
                          {barber.name} – {barber.specialty}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  </div>
                  <p className="text-xs text-muted-foreground">Barbers available at the {selectedBranch.name} branch.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Date */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Select Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      min={todayISO()}
                      onChange={(e) => {
                        setSelectedDate(e.target.value);
                        if (selectedTime && isTimeSlotDisabled(selectedTime, e.target.value)) {
                          setSelectedTime("");
                        }
                      }}
                      className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Select Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full p-3 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                      >
                        <option value="" disabled>Choose time slot</option>
                        {(["Morning", "Afternoon", "Evening"] as const).map((period) => {
                          const slotsInPeriod = timeSlots.filter((t) => getSlotPeriod(t) === period);
                          if (slotsInPeriod.length === 0) return null;
                          return (
                            <optgroup key={period} label={period}>
                              {slotsInPeriod.map((time) => (
                                <option key={time} value={time} disabled={isTimeSlotDisabled(time)}>
                                  {time}
                                  {remainingCapacityByTime[to24Hour(time)] === 0 ? " (Full)" : ""}
                                </option>
                              ))}
                            </optgroup>
                          );
                        })}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Extra Services */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">Extra Services (Optional)</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {extraServices.map(extra => (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra.id)}
                        className={`p-3 rounded-xl border-2 transition-all ${
                          selectedExtras.includes(extra.id)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <span className="text-sm font-medium">{extra.name}</span>
                        <span className="text-xs text-primary block">+₹{extra.price}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any specific requests or notes for your barber..."
                    rows={3}
                    className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate("/login", { state: { from: "/quickbooking" } });
                        return;
                      }
                      if (selectedService && selectedBranch && selectedBarber && selectedDate && selectedTime) {
                        setBookingStep(2);
                      } else {
                        alert("Please select service, branch, barber, date, and time");
                      }
                    }}
                    className={
                      isAuthenticated
                        ? "px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 btn-gold btn-glow"
                        : "uiverse-continue-btn"
                    }
                  >
                    {isAuthenticated ? (
                      "Continue to Details"
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        <span>Login to Continue</span>
                      </>
                    )}
                  </button>
                </div>
                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground text-right">
                    You need to be logged in to book an appointment.
                  </p>
                )}
              </div>
            ) : (
              /* Step 2: Customer Details */
              <div className="space-y-6">
                {/* Customer Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Your Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput value={customerPhone} onChange={setCustomerPhone} error={phoneTouched && !isValidIndianPhone(customerPhone)} />
                    {phoneTouched && customerPhone && !isValidIndianPhone(customerPhone) && (
                      <p className="text-xs text-red-500">Enter a valid 10-digit phone number.</p>
                    )}
                  </div>
                </div>

                {/* Coupon Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-primary" /> Coupon Code
                  </label>
                  {appliedOffer ? (
                    <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-primary">{appliedOffer.code} applied</p>
                        <p className="text-xs text-muted-foreground">{appliedOffer.title}</p>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-muted-foreground hover:text-red-500 transition-colors"
                        aria-label="Remove coupon"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => {
                          setCouponInput(e.target.value);
                          if (couponError) setCouponError("");
                        }}
                        placeholder="Enter coupon code"
                        className="flex-1 p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase placeholder:normal-case"
                      />
                      <button
                        onClick={() => applyCoupon(couponInput)}
                        disabled={isApplyingCoupon}
                        className="btn-gold-outline btn-border-draw px-5 disabled:opacity-60"
                      >
                        {isApplyingCoupon ? "Checking..." : "Apply"}
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                  {!appliedOffer && apiOffers.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {apiOffers.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => applyCoupon(o.code)}
                          className="px-3 py-1.5 rounded-full border border-primary/30 text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
                        >
                          {o.code} · {o.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Booking Summary */}
                <div className="bg-secondary/30 rounded-xl p-6 space-y-4">
                  <h3 className="font-semibold text-foreground flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    Booking Summary
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{selectedService.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Branch:</span>
                      <span className="font-medium">{selectedBranch.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Barber:</span>
                      <span className="font-medium">{selectedBarber.name}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date & Time:</span>
                      <span className="font-medium">{selectedDate} at {selectedTime}</span>
                    </div>
                    {selectedExtras.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Extras:</span>
                        <span className="font-medium">
                          {selectedExtras.map(id => {
                            const extra = extraServices.find(e => e.id === id);
                            return extra.name;
                          }).join(", ")}
                        </span>
                      </div>
                    )}
                    {appliedOffer && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-medium">₹{totalPrice}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                          <span>Discount ({appliedOffer.code}):</span>
                          <span className="font-medium">-₹{discountAmount}</span>
                        </div>
                      </>
                    )}
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">₹{discountedTotal}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="flex-1 btn-gold-outline btn-tilt px-6 py-3"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBookAppointment}
                    disabled={isBookingConfirmed || isSubmittingBooking}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                      isBookingConfirmed
                        ? "bg-green-500 text-white"
                        : "btn-gold btn-pulse-ring"
                    }`}
                  >
                    {isBookingConfirmed ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        Booked! Redirecting to your dashboard...
                      </span>
                    ) : isSubmittingBooking ? (
                      "Booking..."
                    ) : (
                      "Book Appointment"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Free Cancellation
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            No Booking Fee
          </span>
          <span className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            Instant Confirmation
          </span>
        </div>
      </div>
    </section>
  );
};


export default QuickBooking;
