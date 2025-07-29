import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingSpinner = ({
  message = "Loading...",
  size = "md",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="text-center py-6 bg-material-surface rounded-material-medium border border-material-border shadow-material-1">
      <Loader2
        className={`${sizeClasses[size]} mx-auto text-material-primary animate-spin mb-2`}
      />
      <p className="text-material-text-secondary text-sm">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
