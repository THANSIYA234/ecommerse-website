import { Check, Filter } from "lucide-react";
import { CATEGORIES } from "../../data/products";

export default function CategoryFilter({
  activeCategory = "all",
  onChange,
  counts = {},
  className = "",
}) {
  const options = [{ id: "all", label: "All Products" }, ...CATEGORIES];

  return (
    <div className={`category-filter ${className}`} role="group">
      {options.map((option) => {
        const isActive = option.id === activeCategory;
        const count = counts[option.id];

        return (
          <button
            key={option.id}
            type="button"
            className={`category-filter-chip ${isActive ? "category-filter-chip--active" : ""}`}
            aria-pressed={isActive}
            onClick={() => onChange(option.id)}
          >
            {isActive ? <Check size={15} /> : <Filter size={15} />}
            <span>{option.label}</span>
            {count !== undefined && (
              <span className="category-filter-count">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
