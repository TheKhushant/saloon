import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export interface CartProduct {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: Date;
  status: "Processing" | "Delivered";
}

interface CartContextType {
  cartItems: CartItem[];
  wishlistItems: CartProduct[];
  orders: Order[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
  isInCart: (id: string) => boolean;
  toggleWishlist: (product: CartProduct) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  placeOrder: () => Order | null;
  cartCount: number;
  wishlistCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "glamaura_cart";
const WISHLIST_STORAGE_KEY = "glamaura_wishlist";
const ORDERS_STORAGE_KEY = "glamaura_orders";

const readFromStorage = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeToStorage = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage failures (e.g. private browsing quota)
  }
};

const readOrdersFromStorage = (): Order[] => {
  const raw = readFromStorage<Order[]>(ORDERS_STORAGE_KEY, []);
  // Dates come back as strings from JSON — rehydrate them
  return raw.map((o) => ({ ...o, date: new Date(o.date) }));
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() =>
    readFromStorage(CART_STORAGE_KEY, [])
  );
  const [wishlistItems, setWishlistItems] = useState<CartProduct[]>(() =>
    readFromStorage(WISHLIST_STORAGE_KEY, [])
  );
  const [orders, setOrders] = useState<Order[]>(() => readOrdersFromStorage());

  useEffect(() => {
    writeToStorage(CART_STORAGE_KEY, cartItems);
  }, [cartItems]);

  useEffect(() => {
    writeToStorage(WISHLIST_STORAGE_KEY, wishlistItems);
  }, [wishlistItems]);

  useEffect(() => {
    writeToStorage(ORDERS_STORAGE_KEY, orders);
  }, [orders]);

  const addToCart = (product: CartProduct) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const isInCart = (id: string) => cartItems.some((item) => item.id === id);

  const toggleWishlist = (product: CartProduct) => {
    setWishlistItems((prev) =>
      prev.some((item) => item.id === product.id)
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );
  };

  const removeFromWishlist = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const isInWishlist = (id: string) => wishlistItems.some((item) => item.id === id);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = (): Order | null => {
    if (cartItems.length === 0) return null;
    const newOrder: Order = {
      id: `ORD${Date.now()}`,
      items: cartItems,
      total: cartTotal,
      date: new Date(),
      status: "Processing",
    };
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        isInCart,
        toggleWishlist,
        removeFromWishlist,
        isInWishlist,
        placeOrder,
        cartCount,
        wishlistCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
};
