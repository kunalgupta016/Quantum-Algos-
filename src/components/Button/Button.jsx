const VARIANTS = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 border border-blue-700",
  secondary: "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300",
  danger: "bg-red-600 text-white hover:bg-red-700 border border-red-700",
};

const SIZES = {
  sm: "px-3 py-1.5 text-xs rounded",
  md: "px-4 py-2 text-sm rounded",
  lg: "px-5 py-2.5 text-sm rounded font-medium",
};

export default function Button({
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  children,
  className = "",
  ...rest
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-1.5
        transition-colors cursor-pointer
        disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANTS[variant]} ${SIZES[size]} ${className}
      `}
      {...rest}
    >
      {loading && (
        <svg
          className="h-4 w-4 animate-spin text-current"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12" cy="12" r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
