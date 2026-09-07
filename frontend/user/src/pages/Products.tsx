import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ShoppingBag, Heart, ShoppingCart } from "lucide-react";
import { CATEGORY_LABELS, fetchPublicProducts, type ApiProduct } from "@/lib/productsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import RippleButton from "@/components/ui/ripple-button";

// Plain string rather than a fixed literal union since categories are
// driven entirely by whatever the backend returns (HAIR_CARE, BEARD_CARE, ...).
type CategoryId = string;

interface Category {
  id: CategoryId;
  label: string;
  icon: string;
}

interface Product {
  id: string;
  name: string;
  category: CategoryId;
  image: string;
  price: number;
  rating: number;
  reviews: number;
  shortDescription: string;
  description: string;
  benefits: string[];
  howToUse: string;
  ingredients: string;
}

function mapApiProduct(p: ApiProduct): Product {
  const meta = CATEGORY_LABELS[p.category];
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    image: p.imageUrl || "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600",
    price: p.price,
    rating: p.rating ?? 0,
    reviews: p.reviewCount ?? 0,
    shortDescription: p.description ?? "",
    description: p.description ?? "",
    benefits: p.benefits ?? [],
    howToUse: p.howToUse ?? "",
    ingredients: (p.ingredients ?? []).join(", "),
  };
}

const ProductCard = ({
  product,
  onSelect,
  index,
}: {
  product: Product;
  onSelect: (p: Product) => void;
  index: number;
}) => {
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const { toast } = useToast();
  const inWishlist = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({
      title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} ${inWishlist ? "removed from" : "saved to"} your wishlist.`,
    });
  };

  const handleQuickAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 8) * 0.06 }}
      className="group bg-black text-white rounded-2xl border border-black/80 overflow-hidden shadow-md luxury-card"
    >
      <div className="relative w-full h-52 overflow-hidden salon-image-wrap">
        <button
          onClick={() => onSelect(product)}
          className="block w-full h-full"
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </button>

        {/* Wishlist toggle */}
        <button
          onClick={handleToggleWishlist}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors btn-wobble"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-red-500 text-red-500" : "text-gray-700"}`} />
        </button>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-primary text-primary" />
          <span className="text-xs font-medium text-white">{product.rating}</span>
          <span className="text-xs text-white/60">({product.reviews})</span>
        </div>

        <h3 className="font-heading font-semibold text-white mb-1.5 leading-snug">
          {product.name}
        </h3>
        <p className="text-sm text-white/65 mb-4 line-clamp-2">
          {product.shortDescription}
        </p>

        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-bold text-primary">₹{product.price}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(product)}
              className="text-sm font-medium px-4 py-2 rounded-xl border-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors btn-border-draw"
            >
              View Details
            </button>
            <RippleButton
              onClick={handleQuickAddToCart}
              aria-label={`Quick add ${product.name} to cart`}
              className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              rippleColor="rgba(0,0,0,0.25)"
            >
              <ShoppingCart className="w-4 h-4" />
            </RippleButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Products = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);
  const { addToCart, toggleWishlist, isInWishlist, cartCount, wishlistCount } = useCart();
  const { toast } = useToast();

  // Real catalog fetched from the backend. No mock/dummy fallback - if the
  // API is unreachable or returns nothing, the page shows a loading or
  // empty state rather than fabricated products.
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchPublicProducts()
      .then((raw) => {
        if (!cancelled) {
          setProducts(raw.map(mapApiProduct));
          setLoadError(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Category tabs are derived from whichever products actually came back,
  // so a category with no live products doesn't show an empty tab.
  const productCategories: Category[] = Object.entries(CATEGORY_LABELS)
    .filter(([id]) => products.some((p) => p.category === id))
    .map(([id, meta]) => ({ id, ...meta }));

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory, products]);

  const handleModalAddToCart = () => {
    if (!selected) return;
    addToCart({
      id: selected.id,
      name: selected.name,
      price: selected.price,
      image: selected.image,
    });
    toast({ title: "Added to cart", description: `${selected.name} has been added to your cart.` });
  };

  const handleModalToggleWishlist = () => {
    if (!selected) return;
    const wasInWishlist = isInWishlist(selected.id);
    toggleWishlist({
      id: selected.id,
      name: selected.name,
      price: selected.price,
      image: selected.image,
    });
    toast({
      title: wasInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: `${selected.name} ${wasInWishlist ? "removed from" : "saved to"} your wishlist.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        eyebrow="Grooming Shop"
        title="Products for Hair, Beard & Face"
        description="Shop dermatologist-inspired formulas for hair growth, hair fall & scalp care, beard grooming, and everyday face care."
        crumbs={[{ label: "Products" }]}
      />

      <section className="py-16 px-4">
        <div className="container mx-auto">
          {/* Category filters */}
          <div className="flex items-center justify-between gap-4 mb-10">
            <div className="flex gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === "all"
                    ? "gradient-gold text-primary-foreground shadow-md"
                    : "bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/30"
                }`}
              >
                ✨ All Products
              </button>
              {productCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? "gradient-gold text-primary-foreground shadow-md"
                      : "bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/30"
                  }`}
                >
                  {cat.icon} {cat.label}
                </button>
              ))}
            </div>

            {/* Cart & wishlist shortcuts */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Link
                to="/cart?tab=wishlist"
                aria-label="View wishlist"
                className="relative text-muted-foreground hover:text-primary transition-colors"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                    {wishlistCount}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                aria-label="View cart"
                className="relative text-muted-foreground hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-semibold">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className="text-center py-16 text-muted-foreground">
              Loading products...
            </div>
          ) : loadError ? (
            <div className="text-center py-16 text-muted-foreground">
              Couldn't load products right now. Please try again shortly.
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No products found in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} onSelect={setSelected} index={filtered.indexOf(product)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Product details dialog */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl">{selected.name}</DialogTitle>
              </DialogHeader>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="rounded-xl overflow-hidden h-56 sm:h-full">
                  <img
                    src={selected.image}
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{selected.rating}</span>
                    <span className="text-sm text-muted-foreground">({selected.reviews} reviews)</span>
                  </div>
                  <div className="text-2xl font-bold text-primary mb-3">₹{selected.price}</div>
                  <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-4">
                    {productCategories.find((c) => c.id === selected.category)?.icon}{" "}
                    {productCategories.find((c) => c.id === selected.category)?.label}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selected.description}
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 mt-2 border-t border-border pt-5">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Key Benefits</h4>
                  <ul className="space-y-1.5">
                    {selected.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-primary mt-0.5">•</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">How to Use</h4>
                    <p className="text-sm text-muted-foreground">{selected.howToUse}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">Key Ingredients</h4>
                    <p className="text-sm text-muted-foreground">{selected.ingredients}</p>
                  </div>
                </div>
              </div>

              <button onClick={handleModalAddToCart} className="uiverse-cart-btn" aria-label="Add to Cart">
                <div className="uiverse-cart-btn-gradient-container">
                  <div className="uiverse-cart-btn-gradient" />
                </div>
                <span className="uiverse-cart-btn-label">
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </span>
              </button>
              <button
                onClick={handleModalToggleWishlist}
                className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl border-2 border-primary/30 text-primary hover:bg-primary/5 transition-colors btn-elastic"
              >
                <Heart className={`w-4 h-4 ${selected && isInWishlist(selected.id) ? "fill-red-500 text-red-500" : ""}`} />
                {selected && isInWishlist(selected.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Products;
