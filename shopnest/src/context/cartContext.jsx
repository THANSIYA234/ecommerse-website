import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
} from "react";

export const TAX_RATE = 0.08;
export const MAX_QUANTITY = 10;
const STORAGE_KEY = "shopnest.cart";

export const CartContext = createContext(null);

// Create a consistent cart item from a product
const toCartItem = (product, quantity = 1) => ({
  id: product.id,
  name: product.name,
  price: product.price,
  image: product.image,
  category: product.category,
  stock: product.stock ?? MAX_QUANTITY,
  quantity: clampQuantity(quantity),
});

// Keep quantity between 1 and 10
const clampQuantity = (quantity) =>
  Math.min(Math.max(Number(quantity) || 1, 1), MAX_QUANTITY);

// Handle all cart actions
export function cartReducer(state, action) {
  switch (action.type) {
    case "add": {
      const existing = state.find((item) => item.id === action.product.id);

      if (!existing) {
        return [...state, toCartItem(action.product, action.quantity ?? 1)];
      }

      return state.map((item) =>
        item.id === action.product.id
          ? {
              ...item,
              quantity: clampQuantity(item.quantity + (action.quantity ?? 1)),
            }
          : item,
      );
    }

    case "increment":
      return state.map((item) =>
        item.id === action.id
          ? { ...item, quantity: clampQuantity(item.quantity + 1) }
          : item,
      );

    case "decrement":
      return state.map((item) =>
        item.id === action.id
          ? { ...item, quantity: clampQuantity(item.quantity - 1) }
          : item,
      );

    case "remove":
      return state.filter((item) => item.id !== action.id);

    case "clear":
      return [];

    default:
      return state;
  }
}

// Read the saved cart when the app starts
function readStoredCart() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter(
        (item) =>
          item &&
          (typeof item.id === "string" || typeof item.id === "number") &&
          Number(item.quantity) > 0,
      )
      .map((item) => ({
        ...item,
        quantity: clampQuantity(item.quantity),
      }));
  } catch {
    return [];
  }
}

// Share cart state and functions across the app
export default function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], readStoredCart);

  // Save cart whenever items change
  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Cart still works in memory if storage is unavailable
    }
  }, [items]);

  const addItem = useCallback(
    (product, quantity = 1) => dispatch({ type: "add", product, quantity }),
    [],
  );

  const incrementItem = useCallback(
    (id) => dispatch({ type: "increment", id }),
    [],
  );

  const decrementItem = useCallback(
    (id) => dispatch({ type: "decrement", id }),
    [],
  );

  const removeItem = useCallback((id) => dispatch({ type: "remove", id }), []);

  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);

  // Calculate totals and prepare the shared context value
  const value = useMemo(() => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);

    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const tax = subtotal * TAX_RATE;

    return {
      items,
      addItem,
      incrementItem,
      decrementItem,
      removeItem,
      clearCart,
      itemCount,
      isEmpty: items.length === 0,
      subtotal,
      tax,
      total: subtotal + tax,
      taxRate: TAX_RATE,
    };
  }, [items, addItem, incrementItem, decrementItem, removeItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
