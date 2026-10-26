import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import "./NotFound.css";

export default function NotFound() {
  return (
    <div className="page container page--state">
      <div className="not-found">
        <p className="not-found-code">404</p>
        <h1 className="not-found-title">This nest is empty</h1>
        <p className="not-found-body">
          The page you were looking for has moved or never existed. Let’s get
          you back to the good stuff.
        </p>
        <div className="not-found-actions">
          <Link to="/" className="button button--primary">
            Back to home
          </Link>
          <Link to="/products" className="button button--outline">
            Browse products <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
