import { useState } from "react";
import { useCart } from "../../hooks/useCart";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Shield,
  ShoppingBag,
  Trash,
} from "lucide-react";
import { Link } from "react-router-dom";
import CartItem from "../../components/CartItem.jsx";
import { formatCurrency } from "../../utils/format";
import "./Cart.css";

const FREE_SHIPPING_THRESHOLD = 1000;

export default function Cart() {
  const {
    items,
    isEmpty,
    subtotal,
    tax,
    total,
    taxRate,
    itemCount,
    clearCart,
  } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const amountToFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - subtotal, 0);
  const shippingProgress = Math.min(
    (subtotal / FREE_SHIPPING_THRESHOLD) * 100,
    100,
  );

  const placeOrder = () => {
    clearCart();
    setOrderPlaced(true);
  };

  if (orderPlaced) {
    return (
      <div className="page container page--state">
        <div className="order-success">
          <span className="order-success-icon">
            <Check size={34} />
          </span>
          <h1>Thanks for your order</h1>
          <p>Your order is confirmed. A receipt is on its way to your inbox.</p>
          <Link to="/products" className="button button--primary">
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="page container page--state">
        <div className="cart-empty">
          <span className="cart-empty-icon">
            <ShoppingBag size={34} />
          </span>
          <h1>Your cart is empty</h1>
          <p>Nothing here yet. Browse the nest and add something you love.</p>
          <Link to="/products" className="button button--primary">
            Start shopping <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <header className="page-header">
        <h1 className="page-title">Shopping Cart</h1>
        <p className="page-subtitle">
          {itemCount} item{itemCount === 1 ? "" : "s"} in your cart
        </p>
      </header>

      <div className="cart-layout">
        <div className="cart-layout-items">
          <ul className="cart-list">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </ul>

          <div className="cart-actions">
            <Link to="/products" className="button button--outline">
              <ChevronRight size={16} style={{ transform: "rotate(180deg)" }} />{" "}
              Continue shopping
            </Link>
            <button
              type="button"
              className="button button--text"
              onClick={clearCart}
            >
              <Trash size={16} /> Clear cart
            </button>
          </div>
        </div>

        <aside className="cart-summary">
          <h2 className="cart-summary-title">Order Summary</h2>

          <dl className="cart-summary-lines">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatCurrency(subtotal)}</dd>
            </div>
            <div>
              <dt>Estimated tax ({Math.round(taxRate * 100)}%)</dt>
              <dd>{formatCurrency(tax)}</dd>
            </div>
          </dl>

          <div className="cart-summary-total">
            <span>Total</span>
            <strong>{formatCurrency(total)}</strong>
          </div>

          <div className="shipping-meter">
            <div className="shipping-meter-bar">
              <span style={{ width: `${shippingProgress}%` }} />
            </div>
            <p>
              {amountToFreeShipping > 0
                ? `Add ${formatCurrency(amountToFreeShipping)} more for free shipping`
                : "You have unlocked free shipping"}
            </p>
          </div>

          <button
            type="button"
            className="button button--primary button--block"
            onClick={placeOrder}
          >
            <Shield size={18} /> Checkout securely
          </button>
          <p className="cart-summary-note">
            Tax is an estimate and is confirmed at checkout.
          </p>
        </aside>
      </div>
    </div>
  );
}
