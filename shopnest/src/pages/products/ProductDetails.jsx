import { Link, useParams } from "react-router-dom";
import { useProduct, useProducts } from "../../hooks/useProducts";
import { useEffect, useState } from "react";
import Spinner from "../../components/Spinner";
import ErrorState from "../../components/ErrorState";
import {
  discountPercent,
  formatCategory,
  formatCurrency,
} from "../../utils/format";
import {
  Check,
  ChevronRight,
  RefreshCcw,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react";
import QuantityControl from "../../components/navbar/QuatityControl";
import ProductCard from "../../components/products/ProductCard";
import "./Products.css";
import Rating from "../../components/products/Rating";
import { useCart } from "../../hooks/useCart";

export default function ProductDetail() {
  // The route param drives which product is fetched — no lookup from a parent.
  const { id } = useParams();
  const { product, loading, error, refetch } = useProduct(id);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [shownId, setShownId] = useState(id);

  useEffect(() => {
    if (shownId !== id) {
      setShownId(id);
      setQuantity(1);
      setAdded(false);
    }
  }, [id, shownId]);

  useEffect(() => {
    if (!added) return undefined;
    const timer = setTimeout(() => setAdded(false), 2200);
    return () => clearTimeout(timer);
  }, [added]);

  if (loading) {
    return (
      <div className="page container page--state">
        <Spinner label="Loading product details" size={48} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="page container page--state">
        <ErrorState
          title="Product unavailable"
          message={error ?? "That product is no longer in the catalogue."}
          onRetry={refetch}
        />
        <Link to="/products" className="button button--ghost">
          Back to all products
        </Link>
      </div>
    );
  }

  const discount = discountPercent(product.price, product.compareAtPrice);
  const maxQuantity = Math.max(Math.min(product.stock ?? 10, 10), 1);

  return (
    <div className="page container">
      <nav className="breadcrumb">
        <Link to="/">Home</Link>
        <ChevronRight size={14} />
        <Link to="/products">Products</Link>
        <ChevronRight size={14} />
        <Link to={`/products?category=${product.category}`}>
          {formatCategory(product.category)}
        </Link>
        <ChevronRight size={14} />
        <span>{product.name}</span>
      </nav>

      <div className="product-detail">
        <div className="product-detail-media">
          <img
            src={product.image}
            alt={product.name}
            width="720"
            height="720"
          />
          <div className="product-detail-badges">
            {product.badge && <span className="badge">{product.badge}</span>}
            {discount > 0 && (
              <span className="badge badge--sale">-{discount}%</span>
            )}
          </div>
        </div>

        <div className="product-detail-info">
          <p className="product-detail-category">
            {formatCategory(product.category)}
          </p>
          <h1 className="product-detail-title">{product.name}</h1>

          <div className="product-detail-rating">
            <Rating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size={16}
            />
            {product.stock > 0 && (
              <span
                className={`stock-tag ${product.stock <= 10 ? "stock-tag--low" : ""}`}
              >
                {product.stock <= 10
                  ? `Only ${product.stock} left`
                  : "In stock"}
              </span>
            )}
          </div>

          <div className="product-detail-price">
            <span className="product-detail-price-current">
              {formatCurrency(product.price)}
            </span>
            {discount > 0 && (
              <>
                <span className="product-detail-price-was">
                  {formatCurrency(product.compareAtPrice)}
                </span>
                <span className="badge badge--sale">
                  Save {formatCurrency(product.compareAtPrice - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="product-detail-description">{product.description}</p>

          {product.features?.length > 0 && (
            <ul className="product-detail-features">
              {product.features.map((feature) => (
                <li key={feature}>
                  <Check size={16} /> {feature}
                </li>
              ))}
            </ul>
          )}

          <div className="product-detail-buy">
            <QuantityControl
              quantity={quantity}
              min={1}
              max={maxQuantity}
              onIncrease={() =>
                setQuantity((value) => Math.min(value + 1, maxQuantity))
              }
              onDecrease={() => setQuantity((value) => Math.max(value - 1, 1))}
              label="Quantity"
              size="lg"
            />
            <button
              type="button"
              className={`button button--primary button--lg product-detail-add ${added ? "product-detail-add--added" : ""}`}
              onClick={() => {
                addItem(product, quantity);
                setAdded(true);
              }}
            >
              {added ? <Check size={18} /> : <ShoppingBag size={18} />}
              {added ? "Added to cart" : "Add to Cart"}
            </button>
            <Link to="/cart" className="button button--outline button--lg">
              Go to cart
            </Link>
          </div>

          <ul className="product-detail-assurance">
            <li>
              <Truck size={18} /> Free shipping on orders over $50
            </li>
            <li>
              <RefreshCcw size={18} /> 30-day easy returns
            </li>
            <li>
              <Shield size={18} /> Secure checkout
            </li>
          </ul>
        </div>
      </div>

      <RelatedProducts currentId={product.id} category={product.category} />
    </div>
  );
}

/** Cross-sell strip: more from the same category, fetched through the same API. */
function RelatedProducts({ currentId, category }) {
  const { products, loading } = useProducts();
  const related = products
    .filter((item) => item.category === category && item.id !== currentId)
    .slice(0, 4);

  if (loading || related.length === 0) return null;

  return (
    <section className="section" aria-labelledby="related-heading">
      <header className="section__header">
        <h2 id="related-heading" className="section__title">
          You may also like
        </h2>
        <Link to={`/products?category=${category}`} className="section__link">
          View all <ChevronRight size={16} />
        </Link>
      </header>
      <div className="product-grid">
        {related.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}
      </div>
    </section>
  );
}
