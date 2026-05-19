import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Scissors, 
  User, 
  Calendar, 
  Clock, 
  CreditCard, 
  MessageSquare,
  Check,
  ChevronDown,
  Sparkles
} from "lucide-react";

const QuickBooking = () => {
  // Service data with prices
  const services = [
    { id: 1, name: "Haircut", price: 499, icon: "✂️" },
    { id: 2, name: "Beard Trim", price: 299, icon: "🧔" },
    { id: 3, name: "Haircut + Beard Combo", price: 749, icon: "✨" },
    { id: 4, name: "Hair Styling", price: 599, icon: "💇" },
    { id: 5, name: "Facial", price: 899, icon: "🧖" },
    { id: 6, name: "Head Massage", price: 399, icon: "💆" },
  ];

  // Barber data
  const barbers = [
    { id: "any", name: "Any Available Barber", specialty: "Best Match", available: true },
    { id: "rahul", name: "Rahul", specialty: "Senior Stylist", available: true },
    { id: "amit", name: "Amit", specialty: "Hair Specialist", available: true },
    { id: "rohan", name: "Rohan", specialty: "Beard Expert", available: true },
    { id: "priya", name: "Priya", specialty: "Color Expert", available: false }, // Example unavailable
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
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [totalPrice, setTotalPrice] = useState(services[0].price);
  const [bookingStep, setBookingStep] = useState(1); // 1: service selection, 2: customer info
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  // Calculate total price whenever dependencies change
  useEffect(() => {
    const extrasTotal = selectedExtras.reduce((sum, extraId) => {
      const extra = extraServices.find(e => e.id === extraId);
      return sum + (extra?.price || 0);
    }, 0);
    
    setTotalPrice(selectedService.price + extrasTotal);
  }, [selectedService, selectedExtras]);

  // Check if time slot is in the past
  const isTimeSlotDisabled = (timeSlot) => {
    if (!selectedDate) return false;
    
    const today = new Date().toISOString().split('T')[0];
    if (selectedDate < today) return true;
    
    if (selectedDate === today) {
      const now = new Date();
      const [time, modifier] = timeSlot.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      
      const slotTime = new Date();
      slotTime.setHours(hours, minutes, 0);
      
      return slotTime < now;
    }
    
    return false;
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
  const handleBookAppointment = () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTime || !customerName || !customerPhone) {
      alert("Please fill in all required fields");
      return;
    }

    // Here you would typically send this data to your backend
    const bookingData = {
      service: selectedService,
      barber: selectedBarber,
      date: selectedDate,
      time: selectedTime,
      extras: selectedExtras.map(id => extraServices.find(e => e.id === id)),
      specialInstructions,
      customer: { name: customerName, phone: customerPhone },
      totalPrice,
      bookingId: `BOOK${Date.now()}`
    };

    console.log("Booking confirmed:", bookingData);
    setIsBookingConfirmed(true);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setIsBookingConfirmed(false);
      setBookingStep(1);
      // Reset form
      setSelectedService(services[0]);
      setSelectedBarber(barbers[0]);
      setSelectedDate("");
      setSelectedTime("");
      setSelectedExtras([]);
      setSpecialInstructions("");
      setCustomerName("");
      setCustomerPhone("");
    }, 3000);
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
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Quick & Easy Booking
          </span>
          <h2 className="section-heading mb-3">Book Your Appointment</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your service, select your preferred stylist, and book in seconds
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
                          const barber = barbers.find(b => b.id === e.target.value);
                          setSelectedBarber(barber);
                        }}
                        className="w-full p-3 pr-10 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
                      >
                        {barbers.map(barber => (
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
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
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
                        {timeSlots.map(time => (
                          <option 
                            key={time} 
                            value={time}
                            disabled={isTimeSlotDisabled(time)}
                          >
                            {time} {isTimeSlotDisabled(time) && "(Past)"}
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
                    placeholder="Any specific requests or notes for your stylist..."
                    rows={3}
                    className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      if (selectedService && selectedBarber && selectedDate && selectedTime) {
                        setBookingStep(2);
                      } else {
                        alert("Please select service, barber, date, and time");
                      }
                    }}
                    className="btn-gold px-8 py-3"
                  >
                    Continue to Details
                  </button>
                </div>
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
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full p-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
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
                    <div className="border-t border-border pt-3 mt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">₹{totalPrice}</span>
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
                        Booked!
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