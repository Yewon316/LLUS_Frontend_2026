import "../styles/home.css";

export default function SkeletonCard() {
  return (
    <div className="meetingCard skeleton-card" aria-hidden="true">
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-desc" />
      <div className="skeleton-line skeleton-desc skeleton-desc--short" />
      <div className="skeleton-tags">
        <div className="skeleton-line skeleton-tag" />
        <div className="skeleton-line skeleton-tag" />
        <div className="skeleton-line skeleton-tag" />
      </div>
      <div className="skeleton-line skeleton-meta" />
    </div>
  );
}
