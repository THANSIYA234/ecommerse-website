import ErrorState from "../ErrorState";
import Spinner from "../Spinner";
import ProductCard from "./ProductCard";
import "./product.css";

export default function ProductGrid({
  products,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = "No products match your filters yet.",
}) {
  if (loading) {
    return (
      <div className="product-grid-state">
        <Spinner label="Loading products" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-grid-state">
        <ErrorState message={error} onRetry={onRetry} />
      </div>
    );
  }

  if (!products?.length) {
    return (
      <div className="product-grid-state product-grid-state--empty">
        <ErrorState
          title="Nothing to show yet"
          message={emptyMessage}
          icon="package"
          action={
            <a href="/products" className="button button--ghost">
              Browse all products
            </a>
          }
        />
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
