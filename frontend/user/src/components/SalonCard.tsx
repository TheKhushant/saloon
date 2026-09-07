import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface SalonCardProps {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  priceRange: string;
  services: string[];
}

const SalonCard = ({ id, name, image, rating, reviews, location, priceRange, services }: SalonCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="card-salon"
  >
    <div className="relative overflow-hidden h-48">
      <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
      <div className="absolute top-3 right-3 glass rounded-full px-3 py-1 text-xs font-semibold">
        {priceRange}
      </div>
    </div>
    <div className="p-5">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">{name}</h3>
      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
        <MapPin className="w-3.5 h-3.5" /> {location}
      </div>
      <div className="flex items-center gap-1 mb-3">
        <Star className="w-4 h-4 fill-primary text-primary" />
        <span className="text-sm font-semibold">{rating}</span>
        <span className="text-xs text-muted-foreground">({reviews} reviews)</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {services.slice(0, 3).map((s) => (
          <span key={s} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">{s}</span>
        ))}
        {services.length > 3 && (
          <span className="text-xs text-muted-foreground">+{services.length - 3} more</span>
        )}
      </div>
      <Link to={`/salon/${id}`} className="btn-gold btn-depth w-full block text-center text-sm !py-2">
        Book Now
      </Link>
    </div>
  </motion.div>
);

export default SalonCard;
