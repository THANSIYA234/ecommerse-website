import { Star } from "lucide-react";
import "./product.css";

export default function Rating({
  rating = 0,
  reviewCount = 0,
  size = 14,
  showCount = true,
}) {
  const value = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className="rating" title={`${value} out of 5`}>
      <span className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => {
          const fill = Math.max(0, Math.min(1, value - star + 1));

          return (
            <span key={star} className="rating-star">
              <Star size={size} className="rating-star--empty" fill="none" />
              {fill > 0 && (
                <span
                  className="rating-star-fill"
                  style={{ width: `${fill * 100}%` }}
                >
                  <Star
                    size={size}
                    className="rating-star--filled"
                    fill="currentColor"
                  />
                </span>
              )}
            </span>
          );
        })}
      </span>

      <span className="sr-only">{value} out of 5 stars</span>

      {showCount && <span className="rating-count">({reviewCount})</span>}
    </div>
  );
}
