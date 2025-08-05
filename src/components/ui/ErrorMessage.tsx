import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorMessage = ({
  message,
  onRetry,
  showRetry = true,
}: ErrorMessageProps) => (
  <div className="text-center py-6 bg-material-surface rounded-material-medium border border-material-error shadow-material-1">
    <AlertCircle className="w-8 h-8 mx-auto text-material-error mb-2" />
    <p className="text-material-text-primary text-sm mb-2 font-medium">
      Something went wrong
    </p>
    <p className="text-material-text-secondary text-xs mb-3">{message}</p>
    {showRetry && onRetry && (
      <button
        onClick={onRetry}
        className="px-3 py-1.5 bg-material-error hover:bg-red-600 text-material-text-primary rounded-material-small transition-colors duration-[var(--animate-material-fast)] text-xs font-medium flex items-center gap-1 mx-auto shadow-material-1"
      >
        <RefreshCw className="w-3 h-3" />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorMessage;
