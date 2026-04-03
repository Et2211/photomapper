interface ErrorMessageProps {
  message: string | null | undefined;
  size?: "xs" | "sm";
  className?: string;
}

const ErrorMessage = ({ message, size = "sm", className = "" }: ErrorMessageProps) => {
  if (!message) return null;
  return (
    <p className={`text-red-500 ${size === "xs" ? "text-xs" : "text-sm"} ${className}`}>
      {message}
    </p>
  );
};

export default ErrorMessage;
