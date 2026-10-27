import {
  ArrowRight,
  ChevronRight,
  Leaf,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Home.css";

import { CATEGORIES } from "../../data/products";
import CategoryShowcase from "../../components/category/CategoryShowcase";
import ProductGrid from "../../components/products/ProductGrid";
import { useProducts } from "../../hooks/useProducts";
import sofaImage from "../../assets/sofa-image.jpg";
import makeupImage from "../../assets/makeup-image.jpg";
import Newsletter from "../../components/newsletter/NewsLetter";

const PROMO_BANNERS = [
  {
    title: "Refresh Your Space",
    copy: "Modern home essentials for a calmer, happier home.",
    cta: "Shop Home",
    to: "/products?category=home-living",
    image: sofaImage,
    tone: "promo--sand",
  },
  {
    title: "Glow Naturally",
    copy: "Skincare that loves your skin back.",
    cta: "Shop Beauty",
    to: "/products?category=beauty",
    image: makeupImage,
    tone: "promo--rose",
  },
];

export default function Home() {
  const { products, loading, error, refetch } = useProducts();

  const featuredProducts = CATEGORIES.slice(0, 8)
    .map((category) =>
      products.find((product) => product.category === category.id),
    )
    .filter(Boolean);

  const newArrivals = products
    .filter((product) => product.badge === "New")
    .slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="hero-inner container">
          <div className="hero-content">
            <p className="hero-eyebrow">STYLISH. SUSTAINABLE. YOU.</p>

            <h1 className="hero-title">
              Style for a
              <br />
              Brighter Tomorrow
            </h1>

            <p className="hero-body">
              Discover thoughtfully chosen products
              <br />
              for a happier, healthier, and more inspired you.
            </p>

            <div className="hero-actions">
              <Link
                to="/products"
                className="button button--primary button--lg"
              >
                Shop Now <ArrowRight size={18} />
              </Link>
            </div>

            <ul className="hero-points">
              <li>
                <Leaf size={22} />{" "}
                <span>
                  Sustainable
                  <br />
                  Choices
                </span>
              </li>
              <li>
                <Truck size={22} />{" "}
                <span>
                  Fast & Free
                  <br />
                  Shipping
                </span>
              </li>
              <li>
                <ShieldCheck size={22} />{" "}
                <span>
                  Secure
                  <br />
                  Payments
                </span>
              </li>
              <li>
                <Star size={22} />{" "}
                <span>
                  Happy
                  <br />
                  Customers
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="category-showcase-section">
        <div className="container">
          <CategoryShowcase categories={CATEGORIES} />
        </div>
      </section>
      <section className="section container">
        <header className="section__header">
          <h2 id="featured-heading" className="section__title">
            Featured Products
          </h2>
          <Link to="/products" className="section__link">
            View All <ChevronRight />
          </Link>
        </header>
        <ProductGrid
          products={featuredProducts}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </section>
      <section className="container promo-row">
        {PROMO_BANNERS.map((banner) => (
          <article key={banner.title} className={`promo ${banner.tone}`}>
            <img
              src={banner.image}
              alt=""
              width="600"
              height="400"
              loading="lazy"
            />
            <div className="promo-content">
              <h3>{banner.title}</h3>
              <p>{banner.copy}</p>
              <Link to={banner.to} className="button button--primary">
                {banner.cta} <ArrowRight size={16} />
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section className="section container">
        <header className="section__header">
          <h2 id="new-heading" className="section__title">
            New Arrivals
          </h2>
          <Link to="/products?sort=newest" className="section__link">
            View All <ChevronRight size={16} />
          </Link>
        </header>
        <ProductGrid
          products={newArrivals}
          loading={loading}
          error={error}
          onRetry={refetch}
        />
      </section>

      <Newsletter />
    </>
  );
}
