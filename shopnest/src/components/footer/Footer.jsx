import { Link } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  Globe,
  Leaf,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";
import "./Footer.css";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/products" },
      { label: "New Arrivals", to: "/products?sort=newest" },
      { label: "Best Sellers", to: "/products?badge=Best%20Seller" },
      { label: "Deals", to: "/products?onSale=true" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", to: "/contact" },
      { label: "Shipping & Delivery", to: "/contact" },
      { label: "Returns & Refunds", to: "/contact" },
      { label: "Track Your Order", to: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", to: "/contact" },
      { label: "Sustainability", to: "/contact" },
      { label: "Careers", to: "/contact" },
      { label: "Privacy Policy", to: "/contact" },
    ],
  },
];

const SOCIALS = [
  { name: "facebook", label: "Facebook" },
  { name: "twitter", label: "Twitter" },
  { name: "instagram", label: "Instagram" },
  { name: "pinterest", label: "Pinterest" },
];

const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top container">
        <div className="footer-brand">
          <Link to="/" className="brand brand-footer">
            <span className="brand-mark">
              <Leaf size={18} />
            </span>
            <span className="brand-text">
              <strong>ShopNest</strong>
              <small>Good things. A brighter you.</small>
            </span>
          </Link>
          <p className="footer-blurb">
            Thoughtfully curated home, beauty and tech essentials — chosen for
            quality, delivered with care.
          </p>
          <div className="footer-contact">
            <a href="mailto:hello@shopnest.example">
              <Mail size={16} /> hello@shopnest.example
            </a>
            <a href="tel:+917510162040">
              <Phone size={16} /> +917510162040
            </a>
          </div>
          <div className="footer-social">
            {SOCIALS.map((social) => {
              const IconComponent =
                social.name === "facebook"
                  ? Globe
                  : social.name === "twitter"
                    ? Send
                    : social.name === "instagram"
                      ? Camera
                      : MapPin;

              return (
                <a
                  key={social.name}
                  href={`https://shopnest.example/${social.name}`}
                  aria-label={social.label}
                >
                  <IconComponent size={17} />
                </a>
              );
            })}
          </div>
        </div>

        {COLUMNS.map((column) => (
          <nav
            key={column.title}
            className="footer-column"
            aria-label={column.title}
          >
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to}>
                    <ArrowRight size={14} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div className="footer-column footer-column-newsletter">
          <h3>Stay in the loop</h3>
          <p>
            New arrivals, restocks and members-only offers. One email a week, no
            noise.
          </p>
          <form
            className="footer-newsletter"
            onSubmit={(event) => {
              event.preventDefault();
              event.currentTarget.reset();
            }}
          >
            <label className="sr-only" htmlFor="footer-email">
              Email address
            </label>
            <input
              id="footer-email"
              type="email"
              required
              placeholder="you@example.com"
            />
            <button type="submit" aria-label="Subscribe to the newsletter">
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© {CURRENT_YEAR} ShopNest. All rights reserved.</p>
          <ul className="footer-payments">
            {["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay"].map(
              (method) => (
                <li key={method}>{method}</li>
              ),
            )}
          </ul>
        </div>
      </div>
    </footer>
  );
}
