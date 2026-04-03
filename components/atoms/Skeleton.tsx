interface SkeletonProps {
  className?: string;
}

const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`bg-gray-200 animate-pulse rounded ${className}`} />
);

export default Skeleton;
