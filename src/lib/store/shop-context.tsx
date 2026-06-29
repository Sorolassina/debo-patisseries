"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, ProductSnapshot } from "@/lib/store/types";
import { toPackagingCartLine, toProductCartLine } from "@/lib/store/types";

const CART_KEY = "debo-cart";
const FAVORITES_KEY = "debo-favorites";

type Toast = { message: string; id: number } | null;

type ShopContextValue = {
  cart: CartLine[];
  favorites: ProductSnapshot[];
  cartCount: number;
  cartTotal: number;
  addToCart: (product: ProductSnapshot, quantity?: number) => void;
  addPackagingToCart: (input: {
    slug: string;
    name: string;
    priceCents: number;
    imageUrl: string;
    detail: string;
  }) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleFavorite: (product: ProductSnapshot) => boolean;
  isFavorite: (productId: string) => boolean;
  removeFavorite: (productId: string) => void;
  toast: Toast;
  dismissToast: () => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeCartLine(line: CartLine): CartLine {
  return {
    ...line,
    kind: line.kind ?? "product",
    imageAlt: line.imageAlt ?? line.name,
  };
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [favorites, setFavorites] = useState<ProductSnapshot[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<Toast>(null);

  useEffect(() => {
    setCart(readStorage<CartLine[]>(CART_KEY, []).map(normalizeCartLine));
    setFavorites(readStorage(FAVORITES_KEY, []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  }, [cart, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites, hydrated]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2500);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  const addToCart = useCallback(
    (product: ProductSnapshot, quantity = 1) => {
      const incoming = toProductCartLine(product, quantity);
      setCart((prev) => {
        const existing = prev.find((line) => line.id === incoming.id);
        if (existing) {
          return prev.map((line) =>
            line.id === incoming.id
              ? { ...line, quantity: line.quantity + quantity }
              : line,
          );
        }
        return [...prev, incoming];
      });
      showToast(`${product.name} ajouté au panier`);
    },
    [showToast],
  );

  const addPackagingToCart = useCallback(
    (input: {
      slug: string;
      name: string;
      priceCents: number;
      imageUrl: string;
      detail: string;
    }) => {
      const incoming = toPackagingCartLine(input);
      setCart((prev) => {
        const existing = prev.find((line) => line.id === incoming.id);
        if (existing) {
          return prev.map((line) =>
            line.id === incoming.id
              ? { ...line, quantity: line.quantity + 1 }
              : line,
          );
        }
        return [...prev, incoming];
      });
      showToast(`${input.name} ajouté au panier`);
    },
    [showToast],
  );

  const removeFromCart = useCallback((productId: string) => {
    setCart((prev) => prev.filter((line) => line.id !== productId));
  }, []);

  const updateCartQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }
      setCart((prev) =>
        prev.map((line) =>
          line.id === productId ? { ...line, quantity } : line,
        ),
      );
    },
    [removeFromCart],
  );

  const clearCart = useCallback(() => setCart([]), []);

  const isFavorite = useCallback(
    (productId: string) => favorites.some((f) => f.id === productId),
    [favorites],
  );

  const toggleFavorite = useCallback(
    (product: ProductSnapshot) => {
      const already = favorites.some((f) => f.id === product.id);
      if (already) {
        setFavorites((prev) => prev.filter((f) => f.id !== product.id));
        showToast(`${product.name} retiré des favoris`);
        return false;
      }
      setFavorites((prev) => [...prev, product]);
      showToast(`${product.name} ajouté aux favoris`);
      return true;
    },
    [favorites, showToast],
  );

  const removeFavorite = useCallback((productId: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== productId));
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((sum, line) => sum + line.quantity, 0),
    [cart],
  );

  const cartTotal = useMemo(
    () => cart.reduce((sum, line) => sum + line.priceCents * line.quantity, 0),
    [cart],
  );

  const value = useMemo(
    () => ({
      cart,
      favorites,
      cartCount,
      cartTotal,
      addToCart,
      addPackagingToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleFavorite,
      isFavorite,
      removeFavorite,
      toast,
      dismissToast,
    }),
    [
      cart,
      favorites,
      cartCount,
      cartTotal,
      addToCart,
      addPackagingToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      toggleFavorite,
      isFavorite,
      removeFavorite,
      toast,
      dismissToast,
    ],
  );

  return (
    <ShopContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[60] max-w-[90vw] -translate-x-1/2 rounded-full bg-secondary px-6 py-3 font-body text-label-md text-white shadow-xl"
        >
          {toast.message}
        </div>
      ) : null}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error("useShop must be used within ShopProvider");
  }
  return ctx;
}
