interface AvatarProps {
  src: string;
  alt: string;
  size?: "sm" | "md";
  circle?: boolean;
}

const sizeClasses = { sm: "w-10 h-10", md: "w-16 h-16" };

const Avatar = ({ src, alt, size = "md", circle = false }: AvatarProps) => (
  <img
    src={src}
    alt={alt}
    className={`object-cover shrink-0 ${sizeClasses[size]} ${circle ? "rounded-full" : "rounded-lg"}`}
    draggable={false}
  />
);

export default Avatar;
