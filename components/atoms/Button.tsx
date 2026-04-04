import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary: "bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white",
  secondary: "bg-gray-700 hover:bg-gray-600 text-white",
  ghost: "text-blue-600 hover:text-blue-800",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded",
  md: "text-sm px-4 py-2.5 rounded-lg font-medium",
};

const Button = ({
  variant = "secondary",
  size = "sm",
  className = "",
  children,
  ...props
}: ButtonProps) => (
  <button
    className={`transition-colors ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
