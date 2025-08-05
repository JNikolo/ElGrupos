import { X, Loader2 } from "lucide-react";

interface ModalProps {
  children: React.ReactNode;
  handleClose: () => void;
  loading?: boolean;
  icon?: React.ReactNode;
  title?: string;
}

const Modal = ({ children, handleClose, loading, icon, title }: ModalProps) => {
  return (
    <div className="fixed inset-0 bg-material-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-material-surface border border-material-border rounded-material-large shadow-material-8 w-full max-w-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {icon && (
                <div className="w-5 h-5 text-material-primary">{icon}</div>
              )}
              <h3 className="text-lg font-semibold text-material-text-primary">
                {title || "Modal Title"}
              </h3>
              {loading && (
                <Loader2 className="w-4 h-4 text-material-primary animate-spin" />
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-material-text-secondary hover:text-material-text-primary hover:bg-material-elevated rounded-material-small transition-colors"
              aria-label="Close import modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Modal Content */}
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
