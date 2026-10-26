import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  icon = "alert",
  action,
}) {
  const IconComponent = icon === "refresh" ? RefreshCw : AlertCircle;

  return (
    <div className="error-state" role="alert">
      <span className="error-state-icon">
        <IconComponent size={26} />
      </span>

      <h3 className="error-state-title">{title}</h3>

      {message && <p className="error-state-message">{message}</p>}

      {action ??
        (onRetry && (
          <button
            type="button"
            className="button button--primary"
            onClick={onRetry}
          >
            <RefreshCw size={16} />
            Try again
          </button>
        ))}
    </div>
  );
}
