export function PapuaPattern({ className = "", opacity = 0.1 }: { className?: string; opacity?: number }) {
  return (
    <svg
      className={className}
      width="100%"
      height="100%"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <defs>
        <pattern id="papua-pattern" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <path
            d="M 0 40 L 20 20 L 40 40 L 20 60 Z M 40 40 L 60 20 L 80 40 L 60 60 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle cx="20" cy="40" r="3" fill="currentColor" />
          <circle cx="60" cy="40" r="3" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#papua-pattern)" />
    </svg>
  );
}

export function PapuaBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`h-px bg-gradient-to-r from-transparent via-papua-terracotta/20 to-transparent ${className}`} />
  );
}
