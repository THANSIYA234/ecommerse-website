import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar/Navbar";
import Footer from "./footer/Footer";

/** Restores scroll position on navigation — a router app should not keep the old offset. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default function Layout() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content" className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
