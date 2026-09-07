import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Cart = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    wishlistItems,
    updateCartQuantity,
    removeFromCart,
    removeFromWishlist,
    addToCart,
    placeOrder,
    cartTotal,
  } = useCart();
  const { toast } = useToast();

  const activeTab = searchParams.get("tab") === "wishlist" ? "wishlist" : "cart";

  const handleMoveToCart = (item: { id: string; name: string; price: number; image: string }) => {
    addToCart(item);
    removeFromWishlist(item.id);
    toast({ title: "Added to cart", description: `${item.name} moved to your cart.` });
  };

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "Log in to your account to complete checkout.",
      });
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    const order = placeOrder();
    if (!order) return;
    toast({
      title: "Order placed!",
      description: `Your order ${order.id} has been placed successfully.`,
    });
    navigate("/dashboard?tab=orders");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <PageHero
        eyebrow="My Bag"
        title="Cart & Wishlist"
        description="Review the products you've added to your cart, or saved for later in your wishlist."
        crumbs={[{ label: "Cart" }]}
      />

      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-sm text-primary font-medium mb-8 hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>

          <Tabs
            value={activeTab}
            onValueChange={(value) => setSearchParams(value === "wishlist" ? { tab: "wishlist" } : {})}
          >
            <TabsList className="mb-8">
              <TabsTrigger value="cart" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Cart ({cartItems.length})
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Wishlist ({wishlistItems.length})
              </TabsTrigger>
            </TabsList>

            {/* Cart Tab */}
            <TabsContent value="cart">
              {cartItems.length === 0 ? (
                <div className="text-center py-20">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-heading text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Browse our products and add something you love.
                  </p>
                  <Link to="/products" className="btn-gold btn-tilt">
                    Shop Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                        <p className="text-primary font-bold mt-1">₹{item.price}</p>
                      </div>
                      <div className="flex items-center gap-2 border border-border rounded-lg">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:text-primary transition-colors btn-icon-pop"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:text-primary transition-colors btn-icon-pop"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors btn-wobble"
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="flex items-center justify-between bg-secondary/40 rounded-2xl p-6 mt-8">
                    <span className="font-semibold text-lg">Total</span>
                    <span className="font-bold text-2xl text-primary">₹{cartTotal}</span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="btn-gold btn-pulse-ring w-full"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </TabsContent>

            {/* Wishlist Tab */}
            <TabsContent value="wishlist">
              {wishlistItems.length === 0 ? (
                <div className="text-center py-20">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-heading text-xl font-semibold mb-2">Your wishlist is empty</h3>
                  <p className="text-muted-foreground mb-6">
                    Tap the heart icon on any product to save it here.
                  </p>
                  <Link to="/products" className="btn-gold btn-elastic">
                    Shop Products
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-foreground truncate">{item.name}</h4>
                        <p className="text-primary font-bold mt-1">₹{item.price}</p>
                      </div>
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="text-sm font-medium px-4 py-2 rounded-xl border-2 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground transition-colors whitespace-nowrap"
                      >
                        Move to Cart
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                        aria-label={`Remove ${item.name} from wishlist`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Cart;
