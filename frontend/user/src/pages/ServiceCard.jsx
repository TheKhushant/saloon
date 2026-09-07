import { useState } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Tag, Heart, Users, Sparkles } from "lucide-react";

const ServiceCard = ({ service }) => {
  const [isLiked, setIsLiked] = useState(false);

  // Helper function to get category badge color
  const getCategoryColor = (category) => {
    switch(category) {
      case "hair": return "bg-blue-100 text-blue-600 border-blue-200";
      case "beard": return "bg-amber-100 text-amber-600 border-amber-200";
      case "spa": return "bg-purple-100 text-purple-600 border-purple-200";
      case "combo": return "bg-amber-100 text-amber-600 border-emerald-200";
      default: return "bg-primary/10 text-primary border-primary/20";
    }
  };

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case "hair": return "✂️";
      case "beard": return "🪒";
      case "spa": return "🧖";
      case "combo": return "🎁";
      default: return "✨";
    }
  };

  return (
    <div className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
      {/* Premium Badge */}
      {service.isPremium && (
        <div className="absolute top-4 left-4 z-10">
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium shadow-lg">
            <Sparkles className="w-3 h-3" />
            Premium
          </span>
        </div>
      )}

      {/* Like Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
      >
        <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
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
              <Star className="w-3.5 h-3.5 fill-primary text-primary" />
              <span className="text-xs font-medium">{service.rating}</span>
            </div>
          </div>
        </div>

        {/* Service Name */}
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2.5 py-1 bg-secondary/50 rounded-lg text-xs text-muted-foreground"
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
              <span>{service.duration} min</span>
            </div>
            
            {/* Price */}
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-primary">₹{service.price}</span>
              {service.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">₹{service.originalPrice}</span>
              )}
            </div>
          </div>

          {/* Stylist Count */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            <span>{service.stylists}+ stylists</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            to={`/service/${service.id}`}
            className="flex-1 text-center py-2.5 rounded-xl border-2 border-primary/20 text-primary font-medium hover:bg-primary/5 transition-colors text-sm"
          >
            View Details
          </Link>
          <Link
            to={`/book/${service.id}`}
            className="flex-1 text-center py-2.5 rounded-xl btn-gold text-sm"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Hover Effect Line */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
    </div>
  );
};

export default ServiceCard;