import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { Filter, X } from "lucide-react";
import ProductGrid from "../../components/products/ProductGrid";
import { CATEGORIES } from "../../data/products";
import "./Products.css";
import CategoryFilter from "../../components/category/CategoryFilter";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating", label: "Top Rated" },
  { id: "name", label: "Name: A to Z" },
  { id: "newest", label: "Newest" },
];

const sortProducts = (products, sortId) => {
  const sorted = [...products];
  switch (sortId) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "newest":
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
};

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, loading, error, refetch } = useProducts();

  const category = searchParams.get("category") ?? "all";
  const search = searchParams.get("search") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const badge = searchParams.get("badge") ?? "";
  const onSale = searchParams.get("onSale") === "true";

  /** Every filter lives in the URL, so links, refresh and back/forward all agree. */
  const updateParam = (key, value, fallback = "") => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === fallback) {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    setSearchParams(next, { replace: true });
  };

  const counts = useMemo(() => {
    const result = { all: products.length };
    products.forEach((product) => {
      result[product.category] = (result[product.category] ?? 0) + 1;
    });
    return result;
  }, [products]);

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    const filtered = products.filter((product) => {
      if (category !== "all" && product.category !== category) return false;
      if (badge && product.badge !== badge) return false;
      if (
        onSale &&
        !(product.compareAtPrice && product.compareAtPrice > product.price)
      )
        return false;
      if (
        term &&
        !`${product.name} ${product.description}`.toLowerCase().includes(term)
      )
        return false;
      return true;
    });
    return sortProducts(filtered, sort);
  }, [products, category, badge, onSale, search, sort]);

  const hasFilters =
    category !== "all" || search || badge || onSale || sort !== "featured";

  // The heading always names what the shopper is actually looking at.
  const activeCategoryLabel = CATEGORIES.find(
    (item) => item.id === category,
  )?.label;
  const heading =
    badge ||
    (search
      ? `Results for “${search}”`
      : onSale
        ? "Deals"
        : (activeCategoryLabel ?? "All Products"));

  return (
    <div className="page container">
      <header className="page__header">
        <h1 className="page__title">{heading}</h1>
        <p className="page__subtitle">
          {loading
            ? "Loading the catalogue…"
            : `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} ready to browse`}
        </p>
      </header>

      <div className="shop-toolbar">
        <CategoryFilter
          activeCategory={category}
          counts={counts}
          onChange={(nextCategory) => {
            const next = new URLSearchParams(searchParams);
            if (nextCategory === "all") next.delete("category");
            else next.set("category", nextCategory);
            setSearchParams(next, { replace: true });
          }}
        />

        <div className="shop-toolbar-right">
          <label className="sort-select" htmlFor="sort">
            <Filter size={16} />
            <select
              id="sort"
              value={sort}
              onChange={(event) =>
                updateParam("sort", event.target.value, "featured")
              }
            >
              {SORTS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {hasFilters && (
        <div className="active-filters">
          <span>Active filters:</span>
          {category !== "all" && (
            <FilterPill
              label={category}
              onRemove={() => updateParam("category", "")}
            />
          )}
          {search && (
            <FilterPill
              label={`“${search}”`}
              onRemove={() => updateParam("search", "")}
            />
          )}
          {badge && (
            <FilterPill
              label={badge}
              onRemove={() => updateParam("badge", "")}
            />
          )}
          {onSale && (
            <FilterPill
              label="On sale"
              onRemove={() => updateParam("onSale", "")}
            />
          )}
          {sort !== "featured" && (
            <FilterPill
              label={SORTS.find((option) => option.id === sort)?.label}
              onRemove={() => updateParam("sort", "")}
            />
          )}
          <button
            type="button"
            className="active-filters-clear"
            onClick={() => setSearchParams({}, { replace: true })}
          >
            Clear all
          </button>
        </div>
      )}

      <ProductGrid
        products={visibleProducts}
        loading={loading}
        error={error}
        onRetry={refetch}
        emptyMessage={
          search
            ? `No products match “${search}”. Try a different search term or clear your filters.`
            : "No products in this category yet — try another one."
        }
      />
    </div>
  );
}

function FilterPill({ label, onRemove }) {
  return (
    <span className="filter-pill">
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
      >
        <X size={13} />
      </button>
    </span>
  );
}
