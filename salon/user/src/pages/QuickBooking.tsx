import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { offers } from "@/data/mockData";
import PhoneInput from "@/components/PhoneInput";
import { isValidIndianPhone } from "@/lib/validators";

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

const QuickBooking = () => {
  const { isAuthenticated } = useAuth();
  const { addBooking } = useBookings();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  // Service data with prices
  const services = [
    { id: 1, name: "Haircut", price: 499, duration: "30 min", icon: "✂️" },
    { id: 2, name: "Beard Trim", price: 299, duration: "20 min", icon: "🧔" },
    { id: 3, name: "Haircut + Beard Combo", price: 749, duration: "45 min", icon: "✨" },
    { id: 4, name: "Hair Styling", price: 599, duration: "35 min", icon: "💇" },
    { id: 5, name: "Facial", price: 899, duration: "50 min", icon: "🧖" },
    { id: 6, name: "Head Massage", price: 399, duration: "25 min", icon: "💆" },
  ];

  // Nagpur branches, each with its own barbers
  const branches = [
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
  const [bookingStep, setBookingStep] = useState(1); // 1: service selection, 2: customer info
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [appliedOffer, setAppliedOffer] = useState(null);
  const [couponError, setCouponError] = useState("");

  // Calculate total price whenever dependencies change
  useEffect(() => {
    const extrasTotal = selectedExtras.reduce((sum, extraId) => {
      const extra = extraServices.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    
    setTotalPrice(selectedService.price + extrasTotal);
  }, [selectedService, selectedExtras]);

  // Try to apply a coupon code against the shared offers list.
  const applyCoupon = (rawCode) => {
    const code = rawCode.trim().toUpperCase();
    if (!code) {
      setCouponError("Enter a coupon code.");
      return;
    }
    const offer = offers.find((o) => o.code.toUpperCase() === code);
    if (!offer) {
      setAppliedOffer(null);
      setCouponError("This coupon code isn't valid.");
      return;
    }
    if (new Date(offer.validUntil) < new Date()) {
      setAppliedOffer(null);
      setCouponError("This offer has expired.");
      return;
    }
    setAppliedOffer(offer);
    setCouponError("");
    setCouponInput(offer.code);
    toast({
      title: "Coupon applied!",
      description: `${offer.title} has been applied to your booking.`,
    });
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
    ? appliedOffer.discountType === "percent"
      ? Math.round((totalPrice * appliedOffer.discountValue) / 100)
      : Math.min(appliedOffer.discountValue, totalPrice)
    : 0;
  const discountedTotal = Math.max(0, totalPrice - discountAmount);

  // Check if a time slot is in the past, for the currently selected date
  // (or an explicit dateOverride, used right when the date is changing).
  const isTimeSlotDisabled = (timeSlot, dateOverride) =>
    isSlotInPast(dateOverride ?? selectedDate, timeSlot);

  // Handle branch change (resets barber selection to "Any Available" for the new branch)
  const handleBranchChange = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId) || branches[0];
    setSelectedBranch(branch);
    setSelectedBarber({ id: "any", name: "Any Available Barber", specialty: "Best Match", available: true });
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

  const handleBookAppointment = () => {
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

    setIsBookingConfirmed(true);
    
    // Reset after 3 seconds and take the customer to their dashboard to track it
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
    }, 2000);
  };

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto max-w-6xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          {/* <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Quick & Easy Booking
          </span> */}
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
          <div className="flex border-b border-border">
            {[1, 2].map((step) => (
              <div
                key={step}
                className={`flex-1 p-4 text-center ${
                  bookingStep >= step
                    ? "bg-primary/5 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                <span className="text-sm font-medium">
                  Step {step}: {step === 1 ? "Select Services" : "Your Details"}
                </span>
              </div>
            ))}
          </div>

          <div className="p-6 md:p-8">
            {bookingStep === 1 ? (
              /* Step 1: Service Selection */
              <div className="space-y-6">
                {/* Service Selection */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-primary" />
                      Select Service <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedService.id}
                        onChange={(e) => {
                          const service = services.find(s => s.id === parseInt(e.target.value));
                          setSelectedService(service);
                        }}
                        className="w-full p-3 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                      >
                        {services.map(service => (
                          <option key={service.id} value={service.id}>
                            {service.name} - ₹{service.price}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
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

                  {/* Barber Selection */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Select Barber <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedBarber.id}
                        onChange={(e) => {
                          const barber = barbersForBranch.find(b => b.id === e.target.value);
                          setSelectedBarber(barber);
                        }}
                        className="w-full p-3 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                      >
                        {barbersForBranch.map(barber => (
                          <option 
                            key={barber.id} 
                            value={barber.id}
                            disabled={!barber.available}
                          >
                            {barber.name} - {barber.specialty} {!barber.available && "(Unavailable)"}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>
                    <p className="text-xs text-muted-foreground">Barbers available at the {selectedBranch.name} branch.</p>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      Select Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        const newDate = e.target.value;
                        setSelectedDate(newDate);
                        if (selectedTime && isTimeSlotDisabled(selectedTime, newDate)) {
                          setSelectedTime("");
                        }
                      }}
                      min={todayISO()}
                      className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4 text-primary" />
                      Select Time <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        disabled={!selectedDate}
                        className="w-full p-3 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="">Choose time slot</option>
                        {timeSlots
                          .filter((time) => !isTimeSlotDisabled(time))
                          .map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
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
                    className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                      isAuthenticated ? "btn-gold" : "bg-muted text-muted-foreground cursor-not-allowed hover:opacity-90"
                    }`}
                  >
                    {isAuthenticated ? (
                      "Continue to Details"
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" />
                        Login to Continue
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
                        className="btn-gold-outline px-5"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-red-500">{couponError}</p>}
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
                    className="flex-1 btn-gold-outline px-6 py-3"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleBookAppointment}
                    disabled={isBookingConfirmed}
                    className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                      isBookingConfirmed
                        ? "bg-green-500 text-white"
                        : "btn-gold"
                    }`}
                  >
                    {isBookingConfirmed ? (
                      <span className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5" />
                        Booked! Redirecting to your dashboard...
                      </span>
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