import {
  Truck,
  RefreshCw,
  Gift,
  Menu,
  X,
  Leaf,
  Search,
  User,
  ShoppingBag,
} from "lucide-react";
import "./Navbar.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { useCart } from "../../hooks/useCart";

const NAV_LINKS = [
  { to: "/", label: "Home", pathname: "/", search: "" },
  { to: "/products", label: "Shop", pathname: "/products", search: "" },
  {
    to: "/products?badge=New",
    label: "New Arrivals",
    pathname: "/products",
    search: "?badge=New",
  },
  {
    to: "/products?badge=Bestseller",
    label: "Best Sellers",
    pathname: "/products",
    search: "?badge=Best%20seller",
  },
  {
    to: "/products?onSale=true",
    label: "Deals",
    pathname: "/products",
    search: "?onSale=true",
  },
  { to: "/contact", label: "Contact", pathname: "/contact", search: "" },
];
export default function Navbar() {
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // The drawer is keyed to the history entry that opened it: any navigation gives
  // the router a new `location.key`, which closes it without an extra effect.
  const [menuOpenAt, setMenuOpenAt] = useState(null);
  const menuOpen = menuOpenAt !== null && menuOpenAt === location.key;

  const [term, setTerm] = useState("");
  const [termRoute, setTermRoute] = useState(location.key);
  if (termRoute !== location.key) {
    // Leaving the shop clears the search box, matching the query in the URL.
    setTermRoute(location.key);
    if (!location.pathname.startsWith("/products")) setTerm("");
  }
  const submitSearch = (event) => {
    event.preventDefault();
    const query = term.trim();
    navigate(
      query ? `/products?search=${encodeURIComponent(query)}` : "/products",
    );
  };
  return (
    <>
      <div className="announcement-bar">
        <div className="announcement-bar-inner">
          <span>
            <Truck size={20} strokeWidth={1.8} color="var(--amber)" />
            Free shipping on all orders over $50
          </span>

          <span>
            <RefreshCw size={20} strokeWidth={1.8} color="var(--amber)" />
            Easy 30-day returns
          </span>

          <span>
            <Gift size={20} strokeWidth={1.8} color="var(--amber)" />
            Get $10 off your first order
          </span>
        </div>
      </div>
      <header className="navbar">
        <div className="navbar-inner container">
          <button
            type="button"
            className="navbar-toggle"
            onClick={() => setMenuOpenAt(menuOpen ? null : location.key)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <Link to="/" className="brand">
            <span className="brand-mark">
              {" "}
              <Leaf />
            </span>
            <span className="brand-text">
              <strong>ShopNest</strong>
              <small>Good things. A brighter you.</small>
            </span>
          </Link>

          <form className="navbar-search" role="search" onSubmit={submitSearch}>
            <Search size={18} />
            <input
              ref={searchRef}
              type="search"
              name="search"
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              placeholder="Search for products, brands and more..."
            />
            {term && (
              <button
                type="button"
                className="navbar-search-clear"
                onClick={() => setTerm("")}
              >
                <X size={20} />
              </button>
            )}
          </form>

          <div className="navbar-actions">
            <Link to="/contact" className="navbar-action navbar-action--label">
              <User size={20} />
              <span>Account</span>
            </Link>
            <Link to="/cart" className="navbar-action navbar-action--cart">
              <ShoppingBag size={20} />
              <span>Cart</span>
              {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
            </Link>
          </div>
        </div>

        <nav
          id="primary-navigation"
          className={`navbar-nav ${menuOpen ? "navbar-nav--open" : ""}`}
          aria-label="Primary"
        >
          <div className="navbar-nav-inner container">
            {NAV_LINKS.map((link) => {
              // Query-driven links ("Deals", "Best Sellers") are all the same path,
              // so active state has to be resolved against the full URL, not just
              // the pathname the way NavLink does by default.
              const isActive =
                location.pathname === link.pathname &&
                (link.search === ""
                  ? location.search === ""
                  : location.search === link.search);

              return (
                <NavLink
                  key={link.label}
                  to={link.to}
                  className={`navbar-link ${isActive ? "navbar-link--active" : ""}`}
                >
                  {link.label}
                </NavLink>
              );
            })}
          </div>
        </nav>
      </header>
    </>
  );
}
