import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, Heart, ShoppingBag } from "lucide-react";
import Rating from "./Rating";
// import { useCart } from '../hooks/useCart';
import "./product.css";
import { discountPercent, formatCurrency } from "../../utils/format";

export default function ProductCard({ product }) {
  //   const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef(null);

  // Clear the pending "Added" reset if the card unmounts mid-countdown.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const discount = discountPercent(product.price, product.compareAtPrice);
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleAddToCart = () => {
    // addItem(product);
    setJustAdded(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-card-media">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width="420"
          height="420"
        />

        <div className="product-card-badges">
          {product.badge && (
            <span
              className={`badge badge-${product.badge.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="badge badge-sale">-{discount}%</span>
          )}
        </div>

        <button
          type="button"
          className={`product-card-save ${saved ? "product-card-save-active" : ""}`}
          onClick={(event) => {
            event.preventDefault();
            setSaved((value) => !value);
          }}
        >
          <Heart size={18} />
        </button>
      </Link>

      <button
        type="button"
        className={`product-card-add ${justAdded ? "product-card-add-added" : ""}`}
        onClick={handleAddToCart}
      >
        {justAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
        <span className="sr-only">
          {justAdded
            ? `${product.name} added to cart`
            : `Add ${product.name} to cart`}
        </span>
      </button>

      <div className="product-card-body">
        <Link to={`/products/${product.id}`} className="product-card-name">
          {product.name}
        </Link>
        <div className="product-card-price">
          <span className="product-card-price-current">
            {formatCurrency(product.price)}
          </span>
          {discount > 0 && (
            <span className="product-card-price-was">
              {formatCurrency(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="product-card-meta">
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
          {isLowStock && (
            <span className="product-card-stock">
              Only {product.stock} left
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
