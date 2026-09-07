import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  Clock, 
  Star, 
  Heart, 
  Filter,
  Scissors,
  Users,
  Tag,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Twitter,
  Menu,
  X,
  ChevronRight,
  Calendar,
  Award,
  Gift,
  Waves,
  CheckCircle,
  User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { fetchPublicServices, type ApiService } from "@/lib/servicesApi";

// Lucide doesn't ship a dedicated "beard/razor" glyph, so this small
// custom icon fills that gap while matching lucide's stroke style
// (24x24 viewBox, round joins, currentColor) for a consistent look.
const RazorIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M6 3v9a4 4 0 0 0 8 0V3" />
    <path d="M6 3h8" />
    <path d="M10 16v3" />
    <path d="M6 21h8" />
    <path d="M8 21v-2" />
    <path d="M12 21v-2" />
  </svg>
);
import { useToast } from "@/hooks/use-toast";
import { fetchPublicOffers, type ApiOffer } from "@/lib/offersApi";
// Service catalog is fetched from the backend below (superadmin-created
// services that are active + approved) so the Services listing, Service
// Details, and Booking pages all stay in sync with what admins publish -
// no hardcoded fallback list.

// Reviews data
const reviewsData = [
  {
    id: 1,
    name: "Ryan Johnson",
    avatar: "RJ",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    rating: 5,
    text: "Absolutely amazing service! The barber understood exactly what I wanted. Best grooming experience ever!",
    date: "2 days ago",
    service: "Premium Haircut"
  },
  {
    id: 2,
    name: "Michael Chen",
    avatar: "MC",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    rating: 4.5,
    text: "Great atmosphere and professional staff. My new go-to place for grooming.",
    date: "1 week ago",
    service: "Premium Haircut"
  },
  {
    id: 3,
    name: "Ethan Rodriguez",
    avatar: "ER",
    avatarUrl: "https://i.pravatar.cc/150?img=13",
    rating: 5,
    text: "Love the attention to detail and hygiene standards. Highly recommended!",
    date: "3 days ago",
    service: "Men's Facial - Gold"
  },
  {
    id: 4,
    name: "David Kim",
    avatar: "DK",
    avatarUrl: "https://i.pravatar.cc/150?img=14",
    rating: 4.8,
    text: "Professional service, reasonable prices, and great results. Will definitely come back!",
    date: "5 days ago",
    service: "Haircut + Beard Combo"
  }
];

// ==================== MAIN COMPONENT ====================
const SalonListing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State Management
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("");
  const [duration, setDuration] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [filteredServices, setFilteredServices] = useState<ApiService[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [likedServices, setLikedServices] = useState([]);
  // Real, superadmin-approved offers fetched from the backend - no
  // hardcoded fallback, so this only ever shows offers that are actually
  // live.
  const [offers, setOffers] = useState<ApiOffer[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchPublicOffers()
      .then((list) => {
        if (!cancelled) setOffers(list);
      })
      .catch(() => {
        /* No live offers to show - the section below just renders empty. */
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Real, superadmin-created services fetched from the backend - only
  // services that are active + approved come back, no hardcoded fallback,
  // so this catalog always matches what admins have actually published.
  const [services, setServices] = useState<ApiService[]>([]);
  const [servicesLoaded, setServicesLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchPublicServices()
      .then((list) => {
        if (!cancelled) setServices(list);
      })
      .catch(() => {
        /* No live services to show - the catalog below just renders empty. */
      })
      .finally(() => {
        if (!cancelled) setServicesLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Reviews hover state (tracks which review card is currently hovered,
  // and whether the moving row is paused on hover/click)
  const [hoveredReviewKey, setHoveredReviewKey] = useState(null);
  const [isTrackHovered, setIsTrackHovered] = useState(false);
  const [isTrackLocked, setIsTrackLocked] = useState(false);

  // Categories
  const categories = [
    { id: "all", name: "All Services", icon: Sparkles, count: services.length },
    { id: "hair", name: "Hair Services", icon: Scissors, count: services.filter(s => s.category === "hair").length },
    { id: "beard", name: "Beard Care", icon: RazorIcon, count: services.filter(s => s.category === "beard").length },
    { id: "spa", name: "Spa & Skincare", icon: Waves, count: services.filter(s => s.category === "spa").length },
    { id: "combo", name: "Combo Packages", icon: Gift, count: services.filter(s => s.category === "combo").length },
  ];

  // Filter and sort services
  useEffect(() => {
    let results = [...services];

    // Apply category filter
    if (activeCategory !== "all") {
      results = results.filter(s => s.category === activeCategory);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        (s.description || "").toLowerCase().includes(searchLower) ||
        (s.tags || []).some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply price range filter
    if (priceRange) {
      switch(priceRange) {
        case "budget":
          results = results.filter(s => s.price < 500);
          break;
        case "moderate":
          results = results.filter(s => s.price >= 500 && s.price < 1500);
          break;
        case "premium":
          results = results.filter(s => s.price >= 1500);
          break;
        default:
          break;
      }
    }

    // Apply duration filter
    if (duration) {
      switch(duration) {
        case "quick":
          results = results.filter(s => s.durationMinutes < 30);
          break;
        case "medium":
          results = results.filter(s => s.durationMinutes >= 30 && s.durationMinutes < 60);
          break;
        case "long":
          results = results.filter(s => s.durationMinutes >= 60);
          break;
        default:
          break;
      }
    }

    // Apply sorting
    switch(sortBy) {
      case "price_low":
        results.sort((a, b) => a.price - b.price);
        break;
      case "price_high":
        results.sort((a, b) => b.price - a.price);
        break;
      case "duration":
        results.sort((a, b) => a.durationMinutes - b.durationMinutes);
        break;
      case "popular":
        results.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        break;
      default:
        break;
    }

    setFilteredServices(results);
  }, [services, search, activeCategory, priceRange, duration, sortBy]);

  // Toggle like service
  const toggleLike = (serviceId) => {
    if (likedServices.includes(serviceId)) {
      setLikedServices(likedServices.filter(id => id !== serviceId));
    } else {
      setLikedServices([...likedServices, serviceId]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setPriceRange("");
    setDuration("");
    setSortBy("popular");
    setSearch("");
    setActiveCategory("all");
  };

  // Claim an offer: copy its coupon code and send the customer to
  // the booking page with the code pre-applied.
  const handleClaimOffer = async (offer) => {
    try {
      await navigator.clipboard.writeText(offer.code);
    } catch {
      // clipboard access can fail (e.g. insecure context); ignore and still proceed
    }
    toast({
      title: "Offer claimed!",
      description: `Code ${offer.code} copied. Taking you to booking with the discount applied.`,
    });
    navigate(`/quickbooking?code=${offer.code}`);
  };

  // Reveal the CTA image with a slow fade-in only once the user actually
  // scrolls down to that section, instead of loading it in right away.
  const [ctaImageVisible, setCtaImageVisible] = useState(false);
  const [ctaImageLoaded, setCtaImageLoaded] = useState(false);
  const ctaImageRef = useRef(null);

  useEffect(() => {
    const node = ctaImageRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCtaImageVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Get category badge color
  const getCategoryColor = (category) => {
    switch(category) {
      case "hair": return "bg-blue-100 text-blue-600 border-blue-200";
      case "beard": return "bg-primary/10 text-primary border-primary/30";
      case "spa": return "bg-purple-100 text-purple-600 border-purple-200";
      case "combo": return "bg-primary/10 text-primary border-emerald-200";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case "hair": return Scissors;
      case "beard": return RazorIcon;
      case "spa": return Waves;
      case "combo": return Gift;
      default: return Sparkles;
    }
  };

  // Get category display label. Falls back to a capitalized version of
  // whatever category string the admin used, instead of assuming every
  // service falls into one of the four original mock categories.
  const getCategoryLabel = (category) => {
    switch (category) {
      case "hair": return "Hair";
      case "beard": return "Beard";
      case "spa": return "Spa";
      case "combo": return "Combo";
      default:
        return category ? category.charAt(0).toUpperCase() + category.slice(1) : "Service";
    }
  };

  // Renders one review card, sized to match the offer cards above it
  // (full grid-cell width, not a fixed px width) so it never spills
  // past the container like the old rotated marquee cards did.
  const renderReviewCard = (review, index) => {
    const keyId = `${review.id}-${index}`;
    const isHovered = hoveredReviewKey === keyId;

    return (
      <div
        key={keyId}
        onMouseEnter={() => setHoveredReviewKey(keyId)}
        onMouseLeave={() => setHoveredReviewKey(null)}
        className={`relative w-72 sm:w-80 h-96 shrink-0 flex flex-col rounded-2xl p-7 border transition-all duration-500 ease-out ${
          isHovered
            ? "bg-foreground border-black/40 shadow-2xl -translate-y-2"
            : "bg-card border-border shadow-lg"
        }`}
      >
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          {review.avatarUrl ? (
            <img
              src={review.avatarUrl}
              alt={review.name}
              loading="lazy"
              className={`w-16 h-16 rounded-full object-cover border-4 transition-colors duration-500 ${
                isHovered ? "border-primary/40" : "border-border"
              }`}
            />
          ) : (
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold border-4 transition-colors duration-500 ${
                isHovered
                  ? "border-primary/40 bg-primary text-white"
                  : "border-border bg-gradient-to-r from-primary to-primary/80 text-white"
              }`}
            >
              {review.avatar}
            </div>
          )}
        </div>

        {/* Name */}
        <h4
          className={`text-center font-bold text-lg mb-1 truncate transition-colors duration-500 ${
            isHovered ? "text-white" : "text-foreground"
          }`}
        >
          {review.name}
        </h4>

        {/* Service / subtitle */}
        <p
          className={`text-center text-sm mb-4 truncate transition-colors duration-500 ${
            isHovered ? "text-primary" : "text-muted-foreground"
          }`}
        >
          {review.service}
        </p>

        {/* Quote - clamped to 4 lines so every card in the row keeps the
            same fixed footprint no matter how long the review text is */}
        <p
          className={`text-center text-sm leading-relaxed mb-5 line-clamp-4 transition-colors duration-500 ${
            isHovered ? "text-white/70" : "text-muted-foreground"
          }`}
        >
          "{review.text}"
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1 mt-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(review.rating)
                  ? "fill-primary text-primary"
                  : isHovered
                  ? "text-foreground"
                  : "text-muted-foreground/50"
              }`}
            />
          ))}
          <span
            className={`ml-1 text-sm font-semibold transition-colors duration-500 ${
              isHovered ? "text-white" : "text-foreground"
            }`}
          >
            {review.rating}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ==================== NAVBAR ==================== */}
      <Navbar />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-40 pb-16 px-4 overflow-hidden bg-black">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1600"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/70" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-blob-a" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-blob-b" />

        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 text-primary text-xs md:text-sm font-semibold tracking-[0.25em] uppercase mb-4">
              <Scissors className="w-3.5 h-3.5" /> What We Offer
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Grooming Services for{" "}
              <span className="text-gradient-gold">Modern Men</span>
            </h1>
            
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              From classic cuts to premium beard care, discover our comprehensive range of men's grooming services tailored just for you.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for haircut, facial, massage..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-lg"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-white">Expert Barbers</div>
                  <div className="text-xs text-white/50">15+ Professionals</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-white">Flexible Timing</div>
                  <div className="text-xs text-white/50">9 AM - 8 PM</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-white">Special Offers</div>
                  <div className="text-xs text-white/50">20% Off Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MAIN CONTENT ==================== */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {/* Category Tabs */}
          <div className="mb-8 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 min-w-max pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all ${
                    activeCategory === category.id
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {activeCategory === category.id && (
                    <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-xl" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <category.icon className="w-4 h-4" />
                    <span>{category.name}</span>
                    <span className="text-xs bg-card/20 px-2 py-0.5 rounded-full">
                      {category.count}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:border-primary/30 transition-colors bg-card"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
              
              {/* Active Filters Summary */}
              {(priceRange || duration) && (
                <div className="flex items-center gap-2">
                  {priceRange && (
                    <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {priceRange === "budget" ? "Budget" : priceRange === "moderate" ? "Moderate" : "Premium"}
                    </span>
                  )}
                  {duration && (
                    <span className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {duration === "quick" ? "Quick" : duration === "medium" ? "Medium" : "Long"}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="popular">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="duration">Duration: Short to Long</option>
            </select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mb-8 p-6 rounded-2xl bg-card border border-border animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-foreground">Filter Services</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Price Range
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: "", label: "Any" },
                      { value: "budget", label: "Budget (< ₹500)" },
                      { value: "moderate", label: "Moderate (₹500-1500)" },
                      { value: "premium", label: "Premium (> ₹1500)" },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setPriceRange(option.value)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          priceRange === option.value
                            ? "bg-gradient-to-r from-primary to-primary/80 text-white"
                            : "bg-secondary text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Duration
                  </label>
                  <div className="flex gap-2">
                    {[
                      { value: "", label: "Any" },
                      { value: "quick", label: "Quick (< 30 min)" },
                      { value: "medium", label: "Medium (30-60 min)" },
                      { value: "long", label: "Long (> 60 min)" },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setDuration(option.value)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          duration === option.value
                            ? "bg-gradient-to-r from-primary to-primary/80 text-white"
                            : "bg-secondary text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Popular Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Haircut", "Facial", "Massage", "Coloring", "Styling", "Grooming"].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearch(tag)}
                        className="px-3 py-1.5 rounded-full bg-secondary text-xs text-muted-foreground hover:bg-secondary transition-colors"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredServices.length}</span> services found
            </p>
            {activeCategory !== "all" && (
              <button
                onClick={() => setActiveCategory("all")}
                className="text-sm text-primary hover:underline"
              >
                View all services
              </button>
            )}
          </div>

          {/* Services Grid */}
          {!servicesLoaded ? (
            <div className="text-center py-20 text-muted-foreground">Loading services...</div>
          ) : filteredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(service.id)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/90 backdrop-blur-sm hover:bg-card transition-colors btn-wobble"
                  >
                    <Heart className={`w-4 h-4 ${
                      likedServices.includes(service.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-muted-foreground"
                    }`} />
                  </button>

                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Header with Category and Rating */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(service.category)}`}>
                          {(() => {
                            const CategoryIcon = getCategoryIcon(service.category);
                            return <CategoryIcon className="w-3.5 h-3.5" />;
                          })()}
                          {getCategoryLabel(service.category)}
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                          <span className="text-xs font-medium">{service.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Name */}
                    <h3 className="font-semibold text-lg text-foreground mb-2">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(service.tags || []).slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-secondary rounded-lg text-xs text-muted-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Service Details */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Duration */}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{service.durationMinutes} min</span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-primary">₹{service.price}</span>
                          {service.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">₹{service.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      {/* Barber Count */}
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{service.stylists}+ barbers</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        to={`/service/${service.id}`}
                        className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary/80 text-white font-medium hover:shadow-lg text-sm btn-depth"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary/80 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-2xl border border-border">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Search className="w-8 h-8 text-primary/50" />
              </div>
              {services.length === 0 ? (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No services available yet</h3>
                  <p className="text-muted-foreground mb-4">Check back soon - new services are added regularly.</p>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-foreground mb-2">No services found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your filters or search criteria</p>
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:underline"
                  >
                    Clear all filters
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ==================== OFFERS SECTION ==================== */}
      {offers.length > 0 && (
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Special Offers</h2>
              <p className="text-muted-foreground">Exclusive deals just for you</p>
            </div>
            <Award className="w-8 h-8 text-primary" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {offers.map(offer => (
              <div key={offer.id} className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/80/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50 group-hover:opacity-70" />
                
                <div className="relative bg-card border border-border rounded-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-10 -mt-10" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-primary">
                        {offer.discountType === "PERCENTAGE" ? `${offer.discountValue}% OFF` : `₹${offer.discountValue} OFF`}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-xl text-foreground mb-2">
                      {offer.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4">
                      {offer.description}
                    </p>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-secondary/40 border border-dashed border-primary/40 text-xs font-semibold text-primary mb-4 tracking-wide">
                      CODE: {offer.code}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-primary font-medium">
                        {offer.expiresAt
                          ? `Valid until ${new Date(offer.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`
                          : "No expiry"}
                      </span>
                      <button
                        onClick={() => handleClaimOffer(offer)}
                        className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all"
                      >
                        Claim Offer <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ==================== REVIEWS SECTION ==================== */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              What Our Customers Say's
            </h2>
          </div>

          {/* Moving row, clipped to the same container width as the offer
              cards above (not the full screen), so cards keep a fixed
              width while still scrolling past one another like before. */}
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-10 md:w-20 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-10 md:w-20 bg-gradient-to-l from-background to-transparent z-10" />

            <div
              onMouseEnter={() => setIsTrackHovered(true)}
              onMouseLeave={() => setIsTrackHovered(false)}
              onClick={() => setIsTrackLocked((prev) => !prev)}
              style={{
                animation: `reviews-marquee ${reviewsData.length * 8}s linear infinite`,
                animationPlayState: isTrackHovered || isTrackLocked ? "paused" : "running",
              }}
              className="flex gap-6 w-max py-4 cursor-pointer select-none"
            >
              {[...reviewsData, ...reviewsData].map((review, index) =>
                renderReviewCard(review, index)
              )}
            </div>
          </div>
        </div>
      </section>
 
      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div
            ref={ctaImageRef}
            className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl bg-foreground"
          >
            {/* Background image only starts loading once this section
                scrolls into view, then fades in slowly, blurred behind a dark overlay. */}
            {ctaImageVisible && (
              <img
                src="https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?w=1200"
                alt=""
                aria-hidden="true"
                decoding="async"
                onLoad={() => setCtaImageLoaded(true)}
                className={`absolute inset-0 w-full h-full object-cover scale-110 blur- transition-opacity duration-[2000ms] ease-out ${
                  ctaImageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/60 to-black/50" />

            <div className="relative z-10">
              <Calendar className="w-12 h-12 mx-auto mb-6 text-primary" />
              <span className="inline-block text-primary text-sm md:text-base font-semibold tracking-[0.25em] uppercase mb-4">
                Limited Time Offer
              </span>
              <h2 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight drop-shadow-lg">
                Ready for a <span className="text-primary">Fresh Look?</span>
              </h2>
              <p className="text-white/90 mb-10 max-w-xl mx-auto text-lg md:text-xl font-light">
                Book your appointment now and get <span className="font-semibold text-white">20% off</span> on your first visit
              </p>
              <Link
                to="/book"
                className="inline-block px-10 py-4 bg-primary text-white rounded-xl font-semibold text-lg hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-foreground text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-xl flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">
                  Glam<span className="text-primary">Aura</span>
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Your premium destination for men's grooming and wellness. Experience expert barbering in a relaxing environment.
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Twitter].map((Icon, index) => (
                  <a key={index} href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["About Us", "Services", "Gallery", "Contact", "Blog"].map((link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase().replace(" ", "")}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Support</h4>
              <ul className="space-y-2">
                {["FAQ", "Terms of Service", "Privacy Policy", "Cancellation Policy"].map((link) => (
                  <li key={link}>
                    <Link
                      to={`/${link.toLowerCase().replace(/ /g, "-")}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-lg mb-4">Get in Touch</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    Nagpur, India
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <a href="tel:+91 34563 23489" className="text-sm text-muted-foreground hover:text-primary">
                    +91 34563 23489
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <a href="mailto:hello@glamaura.com" className="text-sm text-muted-foreground hover:text-primary">
                    hello@glamaura.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                © 2026 Glam Aura. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="/privacy-policy" className="text-xs text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary">
                  Terms of Use
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS  */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @keyframes reviews-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default SalonListing;