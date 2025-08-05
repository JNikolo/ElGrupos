import { Loader2 } from "lucide-react";

interface StatusMessagesProps {
  loading: boolean;
  errorMessage: string | null;
  successMessage: string | null;
}

const StatusMessages = ({
  loading,
  errorMessage,
  successMessage,
}: StatusMessagesProps) => {
  return (
    <>
      {loading && (
        <div className="absolute inset-0 bg-material-overlay/50 rounded-material-medium z-10 flex items-center justify-center">
          <div className="bg-material-surface px-4 py-2 rounded-material-medium shadow-material-4 flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-material-primary animate-spin" />
            <span className="text-sm text-material-text-primary">
              Importing...
            </span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 bg-material-error/10 border border-material-error/20 rounded-material-medium">
          <p className="text-sm text-material-error">{errorMessage}</p>
        </div>
      )}

      {successMessage && (
        <div className="p-3 bg-material-success/10 border border-material-success/20 rounded-material-medium">
          <p className="text-sm text-material-success">{successMessage}</p>
        </div>
      )}
    </>
  );
};

export default StatusMessages;
