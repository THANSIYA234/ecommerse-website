import { Link } from "react-router-dom";

import women from "../../assets/women.png";
import men from "../../assets/men.png";
import homeLiving from "../../assets/home-living.png";
import beauty from "../../assets/beauty.png";
import electronics from "../../assets/electronics.png";
import sports from "../../assets/sports.png";
import kids from "../../assets/kids.png";
import accessories from "../../assets/accessories.png";
import gifts from "../../assets/gifts.png";
import "./Category.css";

const CATEGORY_IMAGES = {
  women,
  men,
  "home-living": homeLiving,
  beauty,
  electronics,
  sports,
  kids,
  accessories,
  gifts,
};

export default function CategoryShowcase({ categories }) {
  return (
    <section className="category-showcase" aria-label="Shop by category">
      {categories.map((category) => (
        <Link
          key={category.id}
          to={`/products?category=${category.id}`}
          className={`category-showcase__item category-showcase__item--${category.id}`}
        >
          <span className="category-showcase__bubble">
            <img
              src={CATEGORY_IMAGES[category.id] || women}
              alt=""
              className="category-showcase__image"
            />
          </span>

          <span className="category-showcase__label">{category.label}</span>
        </Link>
      ))}
    </section>
  );
}
