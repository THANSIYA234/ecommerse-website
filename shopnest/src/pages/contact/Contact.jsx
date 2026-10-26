import { useState } from "react";

import "./Contact.css";
import {
  AlertCircle,
  Check,
  Clock,
  Mail,
  Phone,
  Pin,
  Truck,
} from "lucide-react";
import { submitContactMessage, toFriendlyError } from "../../api/ProductsApi";

const EMPTY_FORM = {
  name: "",
  email: "",
  subject: "Order enquiry",
  message: "",
};

const SUBJECT_OPTIONS = [
  "Order enquiry",
  "Returns & refunds",
  "Shipping & delivery",
  "Product question",
  "Something else",
];

const validate = (form) => {
  const errors = {};
  if (!form.name.trim()) errors.name = "Please tell us your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = "Enter a valid email address.";
  if (form.message.trim().length < 10)
    errors.message = "Please give us at least a sentence to work with.";
  return errors;
};

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [submitError, setSubmitError] = useState(null);

  const updateField = (field) => (event) => {
    const { value } = event.target;
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) =>
      current[field] ? { ...current, [field]: undefined } : current,
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setStatus("idle");
      return;
    }

    setStatus("submitting");
    setSubmitError(null);

    try {
      await submitContactMessage({
        ...form,
        submittedAt: new Date().toISOString(),
      });
      setStatus("sent");
      setForm(EMPTY_FORM);
    } catch (error) {
      setSubmitError(toFriendlyError(error).message);
      setStatus("error");
    }
  };

  return (
    <div className="page container">
      <header className="page__header page__header--center">
        <h1 className="page__title">Get in touch</h1>
        <p className="page__subtitle">
          Questions about an order, a return or a product? Our team replies
          within one business day.
        </p>
      </header>

      <div className="contact-layout">
        <aside className="contact-info">
          <h2>Talk to us</h2>
          <ul className="contact-info-list">
            <li>
              <span className="contact-info-icon">
                <Mail size={18} />
              </span>
              <div>
                <strong>Email</strong>
                <a href="mailto:hello@shopnest.example">
                  hello@shopnest.example
                </a>
              </div>
            </li>
            <li>
              <span className="contact-info-icon">
                <Phone size={18} />
              </span>
              <div>
                <strong>Phone</strong>
                <a href="tel:+15550145678">+1 (555) 014-5678</a>
              </div>
            </li>
            <li>
              <span className="contact-info-icon">
                <Clock size={18} />
              </span>
              <div>
                <strong>Support hours</strong>
                <span>Mon–Sat, 9am–6pm</span>
              </div>
            </li>
            <li>
              <span className="contact-info-icon">
                <Pin size={18} />
              </span>
              <div>
                <strong>Studio</strong>
                <span>221 Market Lane, Portland, OR</span>
              </div>
            </li>
          </ul>

          <div className="contact-info-card">
            <Truck size={20} />
            <p>
              Free shipping on orders over $50, and 30 days to change your mind
              on everything else.
            </p>
          </div>
        </aside>

        <form className="contact-form" onSubmit={handleSubmit} noValidate>
          <h2>Send us a message</h2>

          {status === "sent" && (
            <div className="form-alert form-alert--success" role="status">
              <Check size={18} />
              <span>Message received. We will be in touch shortly.</span>
            </div>
          )}

          {submitError && (
            <div className="form-alert form-alert--error" role="alert">
              <AlertCircle size={18} />
              <span>{submitError}</span>
            </div>
          )}

          <div className="field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              type="text"
              value={form.name}
              onChange={updateField("name")}
              placeholder="Your name"
            />
            {errors.name && (
              <p className="field-error" id="contact-name-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="field-error" id="contact-email-error">
                {errors.email}
              </p>
            )}
          </div>

          <div className="field">
            <label htmlFor="contact-subject">Subject</label>
            <select
              id="contact-subject"
              value={form.subject}
              onChange={updateField("subject")}
            >
              {SUBJECT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              rows="6"
              value={form.message}
              onChange={updateField("message")}
              placeholder="How can we help?"
            />
            {errors.message && (
              <p className="field__error" id="contact-message-error">
                {errors.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="button button--primary button--lg"
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </div>
  );
}
