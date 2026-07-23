export function FlowerDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-rose-300" />
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <g fill="#e8577f" opacity="0.85">
          <ellipse cx="12" cy="6" rx="3.4" ry="5" />
          <ellipse cx="12" cy="18" rx="3.4" ry="5" />
          <ellipse cx="6" cy="12" rx="5" ry="3.4" />
          <ellipse cx="18" cy="12" rx="5" ry="3.4" />
        </g>
        <circle cx="12" cy="12" r="2.6" fill="#e2bd6c" />
      </svg>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-rose-300" />
    </div>
  );
}
