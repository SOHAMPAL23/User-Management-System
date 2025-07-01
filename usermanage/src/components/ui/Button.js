const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  ghost: "text-gray-700 hover:bg-gray-100",
  destructive: "bg-red-600 text-white hover:bg-red-700",
}

const buttonSizes = {
  sm: "px-3 py-1.5 text-sm",
  default: "px-4 py-2",
  lg: "px-6 py-3 text-lg",
}

export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  disabled = false,
  ...props
}) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  const variantClasses = buttonVariants[variant] || buttonVariants.default
  const sizeClasses = buttonSizes[size] || buttonSizes.default

  return (
    <button className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
