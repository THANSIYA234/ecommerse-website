import { useState } from "react";
import { ArrowRight, Mail } from "lucide-react";
import "./NewsLetter.css";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!email.trim()) return;

    setMessage("Thanks for subscribing to ShopNest!");
    setEmail("");
  }

  return (
    <section className="newsletter container">
      <div className="newsletter__content">
        <span className="newsletter__eyebrow">THE SHOPNEST NEWSLETTER</span>

        <h2>Good things, delivered.</h2>

        <p>
          Get the latest finds, exclusive offers, and inspiration delivered
          straight to your inbox.
        </p>
      </div>

      <div className="newsletter__right">
        <form className="newsletter__form" onSubmit={handleSubmit}>
          <label className="sr-only" htmlFor="newsletter-email">
            Email address
          </label>

          <input
            id="newsletter-email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setMessage("");
            }}
            required
          />

          <button type="submit">
            Subscribe <ArrowRight size={17} />
          </button>
        </form>

        {message && (
          <p className="newsletter__message" role="status">
            {message}
          </p>
        )}

        <small>Get ShopNest updates and exclusive offers.</small>
      </div>
    </section>
  );
}
