import { useContext } from "react";
import { CartContext } from "../context/cartContext";

// Add useContext to the React imports at the top instead.
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
