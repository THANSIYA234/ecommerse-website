import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { Trash } from "lucide-react";
import QuantityControl from "./navbar/QuatityControl";
import { formatCurrency } from "../utils/format";

export default function CartItem({ item }) {
  const { incrementItem, decrementItem, removeItem } = useCart();
  const lineTotal = item.price * item.quantity;

  return (
    <li className="cart-item">
      <Link
        to={`/products/${item.id}`}
        className="cart-item-media"
        aria-label={`View ${item.name}`}
      >
        <img
          src={item.image}
          alt={item.name}
          width="140"
          height="140"
          loading="lazy"
        />
      </Link>

      <div className="cart-item-body">
        <div className="cart-item-heading">
          <Link to={`/products/${item.id}`} className="cart-item-name">
            {item.name}
          </Link>
          <button
            type="button"
            className="cart-item-remove"
            onClick={() => removeItem(item.id)}
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash size={18} />
            <span className="cart-item-remove-text">Remove</span>
          </button>
        </div>

        <p className="cart-item-unit">{formatCurrency(item.price)} each</p>

        <div className="cart-item-controls">
          <QuantityControl
            quantity={item.quantity}
            min={1}
            max={Math.max(item.stock ?? 10, 1)}
            onIncrease={() => incrementItem(item.id)}
            onDecrease={() => decrementItem(item.id)}
            label={`Quantity for ${item.name}`}
          />
          <span className="cart-item-total">{formatCurrency(lineTotal)}</span>
        </div>
      </div>
    </li>
  );
}
