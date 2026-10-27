import { Minus, Plus } from "lucide-react";

/** Quantity stepper shared by the cart page and the product detail page. */
export default function QuantityControl({
  quantity,
  onIncrease,
  onDecrease,
  min = 1,
  max = 10,
  label = "Quantity",
  size = "md",
}) {
  return (
    <div className={`quantity quantity--${size}`}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <Minus size={16} />
      </button>
      <span aria-live="polite" aria-label={`${label}: ${quantity}`}>
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
