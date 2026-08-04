import { useMemo, useState } from "react";
import { Star, ShoppingBag } from "lucide-react";
import { products, productCategories } from "@/data/mockData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type CategoryId = (typeof productCategories)[number]["id"];
type Product = (typeof products)[number];

const ProductCard = ({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (p: Product) => void;
}) => (
  <div className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
    <button
      onClick={() => onSelect(product)}
      className="relative w-full h-52 overflow-hidden block"
      aria-label={`View details for ${product.name}`}
    >
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
    </button>

    <div className="p-5">
      <div className="flex items-center gap-1 mb-2">
        <Star className="w-3.5 h-3.5 fill-primary text-primary" />
        <span className="text-xs font-medium">{product.rating}</span>
        <span className="text-xs text-muted-foreground">({product.reviews})</span>
      </div>

      <h3 className="font-heading font-semibold text-foreground mb-1.5 leading-snug">
        {product.name}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {product.shortDescription}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-primary">₹{product.price}</span>
        <button
          onClick={() => onSelect(product)}
          className="text-sm font-medium px-4 py-2 rounded-xl border-2 border-primary/20 text-primary hover:bg-primary/5 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  </div>
);

const Products = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId | "all">("all");
  const [selected, setSelected] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    if (activeCategory === "all") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16 px-4 border-b border-border">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <ShoppingBag className="w-3.5 h-3.5" />
            Grooming Shop
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Products for Hair, Beard & Face
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Shop dermatologist-inspired formulas for hair growth, hair fall & scalp care, beard grooming, and everyday face care.
          </p>
        </div>
      </section>

      <section className="py-10 px-4">
        <div className="container mx-auto">
          {/* Category filters */}
          <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
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

          {/* Product grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No products found in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} onSelect={setSelected} />
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

              <button className="btn-gold w-full mt-4 flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" /> Add to Cart
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
