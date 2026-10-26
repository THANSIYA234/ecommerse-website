/** Accessible loading indicator used while any request is in flight. */
export default function Spinner({ label = "Loading", size = 40 }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <span className="spinner-ring" style={{ width: size, height: size }} />
      <span className="spinner-label">{label}</span>
    </div>
  );
}
