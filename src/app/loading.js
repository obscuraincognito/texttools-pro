export default function Loading() {
  return (
    <div className="loading-skeleton">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-subtitle" />
      <div className="skeleton-container">
        <div className="skeleton-line skeleton-body" />
        <div className="skeleton-actions">
          <div className="skeleton-line skeleton-btn" />
          <div className="skeleton-line skeleton-btn-sm" />
        </div>
      </div>
    </div>
  );
}
