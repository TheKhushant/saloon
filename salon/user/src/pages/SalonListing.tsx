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
  CheckCircle,
  User
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { offers as offersData } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

// ==================== MOCK DATA ====================
const servicesData = [
  // Hair Services
  {
    id: 1,
    name: "Premium Haircut",
    description: "Expert haircut with consultation, wash, and styling. Includes hot towel treatment.",
    price: 599,
    originalPrice: 799,
    duration: 45,
    category: "hair",
    image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixlib=rb-4.0.3",
    rating: 4.9,
    stylists: 6,
    popularity: 95,
    tags: ["haircut", "styling", "grooming"],
    benefits: ["Hot towel", "Hair wash", "Style consultation"]
  },
  {
    id: 2,
    name: "Classic Fade",
    description: "Precision skin fade or taper with clean line-ups and finishing styling.",
    price: 649,
    duration: 40,
    category: "hair",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRykJOJKDB7hMTetMjJ5hT_vna25-jqSEHd8cOqHqvDpCnV8Mva-rRVtmI&s=10",
    rating: 4.8,
    stylists: 5,
    popularity: 90,
    tags: ["fade", "haircut", "styling"],
    benefits: ["Clean line-up", "Precision clippers", "Style finish"]
  },
  {
    id: 3,
    name: "Hair Color for Men",
    description: "Natural-looking grey coverage or full color with premium ammonia-free products.",
    price: 999,
    duration: 60,
    category: "hair",
    image: "https://rukminim2.flixcart.com/image/480/640/xif0q/hair-color/w/k/r/grey-hair-color-wax-washable-instant-color-for-man-woman-1-original-imahc39jzw9uqtyk.jpeg?q=90",
    rating: 4.7,
    stylists: 4,
    popularity: 78,
    tags: ["color", "grey coverage", "premium"],
    benefits: ["Ammonia-free", "Natural finish", "Long lasting"]
  },
  // Beard Services
  {
    id: 4,
    name: "Royal Beard Grooming",
    description: "Complete beard care with trim, shape, massage, and oil treatment.",
    price: 399,
    duration: 30,
    category: "beard",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3",
    rating: 4.8,
    stylists: 5,
    popularity: 88,
    tags: ["beard", "grooming", "trim"],
    benefits: ["Beard shaping", "Hot towel", "Beard oil"]
  },
  {
    id: 5,
    name: "Hot Towel Razor Shave",
    description: "Traditional straight-razor shave with hot towel prep and soothing aftercare.",
    price: 349,
    duration: 25,
    category: "beard",
    image: "https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?ixlib=rb-4.0.3",
    rating: 4.9,
    stylists: 4,
    popularity: 84,
    tags: ["shave", "razor", "beard"],
    benefits: ["Hot towel prep", "Straight razor", "Soothing balm"]
  },
  {
    id: 6,
    name: "Beard Coloring",
    description: "Natural-toned beard color to cover greys and sharpen your look.",
    price: 449,
    duration: 30,
    category: "beard",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaqpmSm9Vvu3br81-jkNWAa6aCzYX9LYxm_0L5Y_Mq22-H7mEuvD0lVrRY&s=10",
    rating: 4.6,
    stylists: 3,
    popularity: 70,
    tags: ["beard", "color", "grooming"],
    benefits: ["Grey coverage", "Natural tone", "Quick service"]
  },
  // Spa & Skincare
  {
    id: 7,
    name: "Men's Facial - Gold",
    description: "Deep cleansing facial with charcoal mask, extraction, and face massage.",
    price: 899,
    duration: 60,
    category: "spa",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?ixlib=rb-4.0.3",
    rating: 4.9,
    stylists: 4,
    popularity: 82,
    tags: ["facial", "skincare", "premium"],
    benefits: ["Deep cleansing", "Extraction", "Face massage"]
  },
  {
    id: 8,
    name: "Head Massage (Aromatherapy)",
    description: "Relaxing head, neck, and shoulder massage with essential oils.",
    price: 499,
    duration: 30,
    category: "spa",
    image: "https://www.shutterstock.com/image-photo/handsome-young-man-receiving-facial-260nw-2495436809.jpg",
    rating: 4.9,
    stylists: 8,
    popularity: 94,
    tags: ["massage", "relaxation", "spa"],
    benefits: ["Aromatherapy", "Stress relief", "Essential oils"]
  },
  {
    id: 9,
    name: "De-Tan Body Massage",
    description: "Full-body de-tan massage with scrub to refresh and even out skin tone.",
    price: 999,
    duration: 75,
    category: "spa",
    image: "https://fullmassageamritsar.in/wp-content/uploads/2023/12/balinese-11.jpg",
    rating: 4.7,
    stylists: 5,
    popularity: 76,
    tags: ["massage", "de-tan", "spa"],
    benefits: ["Exfoliating scrub", "Even skin tone", "Full body"]
  },
  // Combo Packages
  {
    id: 10,
    name: "Haircut + Beard Combo",
    description: "Complete grooming package with haircut and beard styling.",
    price: 899,
    originalPrice: 1099,
    duration: 75,
    category: "combo",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixlib=rb-4.0.3",
    rating: 5.0,
    stylists: 7,
    popularity: 98,
    tags: ["combo", "haircut", "beard"],
    benefits: ["Save ₹200", "Complete grooming", "Style advice"]
  },
  {
    id: 11,
    name: "Grooming Package",
    description: "Haircut, beard styling, and a deep-cleansing facial in one session.",
    price: 1499,
    originalPrice: 1799,
    duration: 120,
    category: "combo",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?ixlib=rb-4.0.3",
    rating: 4.9,
    stylists: 6,
    popularity: 89,
    tags: ["combo", "grooming", "facial"],
    benefits: ["Save ₹300", "3-in-1 package", "Premium products"]
  },
  {
    id: 12,
    name: "Groom-to-Be Package",
    description: "Full pre-wedding grooming package: haircut, shave, facial, and massage.",
    price: 2999,
    duration: 180,
    category: "combo",
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3",
    rating: 5.0,
    stylists: 3,
    popularity: 80,
    tags: ["combo", "groom", "wedding"],
    benefits: ["Complete makeover", "Dedicated barber", "Priority slot"]
  }
];



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
  const [filteredServices, setFilteredServices] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [likedServices, setLikedServices] = useState([]);

  // Reviews marquee state
  const [hoveredReviewKey, setHoveredReviewKey] = useState(null);
  const [isTrackHovered, setIsTrackHovered] = useState(false);
  const [isTrackLocked, setIsTrackLocked] = useState(false);

  // Categories
  const categories = [
    { id: "all", name: "All Services", icon: "✨", count: servicesData.length },
    { id: "hair", name: "Hair Services", icon: "✂️", count: servicesData.filter(s => s.category === "hair").length },
    { id: "beard", name: "Beard Care", icon: "🪒", count: servicesData.filter(s => s.category === "beard").length },
    { id: "spa", name: "Spa & Skincare", icon: "🧖", count: servicesData.filter(s => s.category === "spa").length },
    { id: "combo", name: "Combo Packages", icon: "🎁", count: servicesData.filter(s => s.category === "combo").length },
  ];

  // Filter and sort services
  useEffect(() => {
    let results = [...servicesData];

    // Apply category filter
    if (activeCategory !== "all") {
      results = results.filter(s => s.category === activeCategory);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      results = results.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchLower))
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
          results = results.filter(s => s.duration < 30);
          break;
        case "medium":
          results = results.filter(s => s.duration >= 30 && s.duration < 60);
          break;
        case "long":
          results = results.filter(s => s.duration >= 60);
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
        results.sort((a, b) => a.duration - b.duration);
        break;
      case "popular":
        results.sort((a, b) => b.popularity - a.popularity);
        break;
      default:
        break;
    }

    setFilteredServices(results);
  }, [search, activeCategory, priceRange, duration, sortBy]);

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
      case "beard": return "bg-orange-100 text-orange-600 border-orange-200";
      case "spa": return "bg-purple-100 text-purple-600 border-purple-200";
      case "combo": return "bg-emerald-100 text-emerald-600 border-emerald-200";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case "hair": return "✂️";
      case "beard": return "🪒";
      case "spa": return "🧖";
      case "combo": return "🎁";
      default: return "✨";
    }
  };

  // Tilt angles cycled across cards for the scattered look
  const cardRotations = [-6, 4, -3, 5, -5, 3];

  // Renders one review card. `index` is the position within the
  // (possibly duplicated) marquee list, used for both the rotation
  // angle and a unique key since the list is rendered twice.
  const renderReviewCard = (review, index) => {
    const keyId = `${review.id}-${index}`;
    const isHovered = hoveredReviewKey === keyId;
    const rotation = cardRotations[index % cardRotations.length];

    return (
      <div
        key={keyId}
        onMouseEnter={() => setHoveredReviewKey(keyId)}
        onMouseLeave={() => setHoveredReviewKey(null)}
        style={{
          transform: isHovered
            ? "rotate(0deg) scale(1.08) translateY(-8px)"
            : `rotate(${rotation}deg)`,
          zIndex: isHovered ? 30 : 1,
        }}
        className={`relative w-64 sm:w-72 shrink-0 rounded-2xl p-7 border transition-all duration-500 ease-out ${
          isHovered
            ? "bg-gray-900 border-gray-900 shadow-2xl"
            : "bg-white border-gray-200 shadow-lg"
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
                isHovered ? "border-amber-500/40" : "border-amber-100"
              }`}
            />
          ) : (
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-semibold border-4 transition-colors duration-500 ${
                isHovered
                  ? "border-amber-500/40 bg-amber-500 text-white"
                  : "border-amber-100 bg-gradient-to-r from-amber-500 to-amber-600 text-white"
              }`}
            >
              {review.avatar}
            </div>
          )}
        </div>

        {/* Name */}
        <h4
          className={`text-center font-bold text-lg mb-1 transition-colors duration-500 ${
            isHovered ? "text-white" : "text-gray-800"
          }`}
        >
          {review.name}
        </h4>

        {/* Service / subtitle */}
        <p
          className={`text-center text-sm mb-4 transition-colors duration-500 ${
            isHovered ? "text-amber-400" : "text-gray-400"
          }`}
        >
          {review.service}
        </p>

        {/* Quote */}
        <p
          className={`text-center text-sm leading-relaxed mb-5 transition-colors duration-500 ${
            isHovered ? "text-gray-200" : "text-gray-600"
          }`}
        >
          "{review.text}"
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(review.rating)
                  ? "fill-amber-500 text-amber-500"
                  : isHovered
                  ? "text-gray-700"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span
            className={`ml-1 text-sm font-semibold transition-colors duration-500 ${
              isHovered ? "text-white" : "text-gray-800"
            }`}
          >
            {review.rating}
          </span>
        </div>
      </div>
    );
  };

  // Marquee pauses while the row is hovered, or permanently until
  // clicked again if the row has been clicked (locked).
  const isMarqueePaused = isTrackHovered || isTrackLocked;
  const marqueeDuration = reviewsData.length * 8; // seconds

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* ==================== NAVBAR ==================== */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-800">
                Glam<span className="text-amber-500">Aura</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <Navbar/>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100 animate-fadeIn">
              {["Home", "Services", "Gallery", "About", "Contact"].map((item) => (
                <Link
                  key={item}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-gray-600 hover:text-amber-500 transition-colors"
                >
                  {item}
                </Link>
              ))}
              <Link
                to="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="block mt-3 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium text-center"
              >
                Book Now
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-transparent" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-amber-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-pink-100 rounded-full blur-3xl opacity-30" />
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4">
              Grooming Services for{" "}
              <span className="bg-gradient-to-r from-amber-500 to-amber-600 bg-clip-text text-transparent">
                Modern Men
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              From classic cuts to premium beard care, discover our comprehensive range of men's grooming services tailored just for you.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for haircut, facial, massage..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 shadow-lg"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">Expert Barbers</div>
                  <div className="text-xs text-gray-500">15+ Professionals</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">Flexible Timing</div>
                  <div className="text-xs text-gray-500">9 AM - 8 PM</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Tag className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-800">Special Offers</div>
                  <div className="text-xs text-gray-500">20% Off Today</div>
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
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  {activeCategory === category.id && (
                    <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl" />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                    <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
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
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-amber-500/30 transition-colors bg-white"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
              
              {/* Active Filters Summary */}
              {(priceRange || duration) && (
                <div className="flex items-center gap-2">
                  {priceRange && (
                    <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-600 text-xs font-medium">
                      {priceRange === "budget" ? "Budget" : priceRange === "moderate" ? "Moderate" : "Premium"}
                    </span>
                  )}
                  {duration && (
                    <span className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-600 text-xs font-medium">
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
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="popular">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="duration">Duration: Short to Long</option>
            </select>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mb-8 p-6 rounded-2xl bg-white border border-gray-200 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Filter Services</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-amber-600 hover:underline"
                >
                  Clear all
                </button>
              </div>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Price Range Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
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
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
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
                            ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Tags */}
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Popular Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Haircut", "Facial", "Massage", "Coloring", "Styling", "Grooming"].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearch(tag)}
                        className="px-3 py-1.5 rounded-full bg-gray-100 text-xs text-gray-600 hover:bg-gray-200 transition-colors"
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
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-800">{filteredServices.length}</span> services found
            </p>
            {activeCategory !== "all" && (
              <button
                onClick={() => setActiveCategory("all")}
                className="text-sm text-amber-600 hover:underline"
              >
                View all services
              </button>
            )}
          </div>

          {/* Services Grid */}
          {filteredServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Premium Badge */}
                  {service.isPremium && (
                    <div className="absolute top-4 left-4 z-10">
                      <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        Premium
                      </span>
                    </div>
                  )}

                  {/* Like Button */}
                  <button
                    onClick={() => toggleLike(service.id)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${
                      likedServices.includes(service.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-gray-600"
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(service.category)}`}>
                          {getCategoryIcon(service.category)} {
                            service.category === "hair" ? "Hair" :
                            service.category === "beard" ? "Beard" :
                            service.category === "spa" ? "Spa" : "Combo"
                          }
                        </span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span className="text-xs font-medium">{service.rating}</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Name */}
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {service.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Service Details */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Duration */}
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{service.duration} min</span>
                        </div>
                        
                        {/* Price */}
                        <div className="flex items-center gap-1">
                          <span className="text-lg font-bold text-amber-600">₹{service.price}</span>
                          {service.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{service.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      {/* Barber Count */}
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Users className="w-3 h-3" />
                        <span>{service.stylists}+ barbers</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        to={`/service/${service.id}`}
                        className="flex-1 text-center py-2.5 rounded-xl border-2 border-amber-500/20 text-amber-600 font-medium hover:bg-amber-50 transition-colors text-sm"
                      >
                        View Details
                      </Link>
                      <Link
                        to={`/book/${service.id}`}
                        className="flex-1 text-center py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium hover:shadow-lg text-sm"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>

                  {/* Hover Effect Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <Search className="w-8 h-8 text-amber-500/50" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No services found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
              <button
                onClick={clearFilters}
                className="text-amber-600 hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ==================== OFFERS SECTION ==================== */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Special Offers</h2>
              <p className="text-gray-600">Exclusive deals just for you</p>
            </div>
            <Award className="w-8 h-8 text-amber-500" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {offersData.map(offer => (
              <div key={offer.id} className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-amber-600/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all opacity-50 group-hover:opacity-70" />
                
                <div className="relative bg-white border border-gray-200 rounded-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-10 -mt-10" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                        <Gift className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm font-medium text-amber-600">{offer.type}</span>
                    </div>
                    
                    <h3 className="font-bold text-xl text-gray-800 mb-2">
                      {offer.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 mb-4">
                      {offer.description}
                    </p>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 border border-dashed border-amber-300 text-xs font-semibold text-amber-700 mb-4 tracking-wide">
                      CODE: {offer.code}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-600 font-medium">
                        Valid until {new Date(offer.validUntil).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <button
                        onClick={() => handleClaimOffer(offer)}
                        className="flex items-center gap-1 text-sm font-medium text-amber-600 group-hover:gap-2 transition-all"
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

      {/* ==================== REVIEWS SECTION ==================== */}
      <section className="py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500 text-white text-sm font-medium mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              Our Testimonials
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
              What Our Customers Say's
            </h2>
          </div>
        </div>

        {/* Marquee wrapper - clips the looping track to viewport width */}
        <div className="relative w-full overflow-hidden">
          {/* Edge fade so cards don't appear to cut off harshly */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 md:w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 md:w-24 bg-gradient-to-l from-white to-transparent z-10" />

          <div
            onMouseEnter={() => setIsTrackHovered(true)}
            onMouseLeave={() => setIsTrackHovered(false)}
            onClick={() => setIsTrackLocked((prev) => !prev)}
            style={{
              animation: `marquee ${marqueeDuration}s linear infinite`,
              animationPlayState: isMarqueePaused ? "paused" : "running",
            }}
            className="flex gap-6 w-max py-10 cursor-pointer select-none"
          >
            {[...reviewsData, ...reviewsData].map((review, index) =>
              renderReviewCard(review, index)
            )}
          </div>
        </div>
      </section>
 
      {/* ==================== CTA SECTION ==================== */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div
            ref={ctaImageRef}
            className="relative overflow-hidden rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl bg-gray-900"
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
              <Calendar className="w-12 h-12 mx-auto mb-6 text-amber-400" />
              <span className="inline-block text-amber-400 text-sm md:text-base font-semibold tracking-[0.25em] uppercase mb-4">
                Limited Time Offer
              </span>
              <h2 className="text-4xl md:text-6xl font-bold mb-5 tracking-tight leading-tight drop-shadow-lg">
                Ready for a <span className="text-amber-400">Fresh Look?</span>
              </h2>
              <p className="text-white/90 mb-10 max-w-xl mx-auto text-lg md:text-xl font-light">
                Book your appointment now and get <span className="font-semibold text-white">20% off</span> on your first visit
              </p>
              <Link
                to="/book"
                className="inline-block px-10 py-4 bg-amber-500 text-white rounded-xl font-semibold text-lg hover:bg-amber-400 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                Book Your Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Scissors className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-xl">
                  Glam<span className="text-amber-500">Aura</span>
                </span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Your premium destination for men's grooming and wellness. Experience expert barbering in a relaxing environment.
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Twitter].map((Icon, index) => (
                  <a key={index} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-amber-600 transition-colors">
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
                      className="text-sm text-gray-400 hover:text-amber-500 transition-colors"
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
                      className="text-sm text-gray-400 hover:text-amber-500 transition-colors"
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
                  <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-400">
                    Nagpur, India
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-amber-500 shrink-0" />
                  <a href="tel:+91 34563 23489" className="text-sm text-gray-400 hover:text-amber-500">
                    +91 34563 23489
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-amber-500 shrink-0" />
                  <a href="mailto:hello@glamaura.com" className="text-sm text-gray-400 hover:text-amber-500">
                    hello@glamaura.com
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500">
                © 2026 Glam Aura. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="/privacy" className="text-xs text-gray-500 hover:text-amber-500">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-xs text-gray-500 hover:text-amber-500">
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

        @keyframes marquee {
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