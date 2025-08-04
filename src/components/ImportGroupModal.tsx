import { X, Edit3, BookOpenText, FileJson } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { useState } from "react";

interface ImportGroupModalProps {
  handleClose: () => void;
}

const ImportGroupModal = ({ handleClose }: ImportGroupModalProps) => {
  const [loading] = useState(false);
  const [importFormat, setImportFormat] = useState<"text" | "file">("text");

  return (
    <div className="fixed inset-0 bg-material-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-material-surface border border-material-border rounded-material-large shadow-material-8 w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <Edit3 className="w-5 h-5 text-material-primary" />
                  <h3 className="text-lg font-semibold text-material-text-primary">
                    Import Group
                  </h3>
                </>
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-material-text-secondary hover:text-material-text-primary hover:bg-material-elevated rounded-material-small transition-colors duration-[var(--animate-material-fast)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Content */}
          <div className="space-y-4">
            {/* Export Format Toggle */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm font-medium text-material-text-secondary">
                Import as:
              </span>
              <div className="flex bg-material-elevated rounded-material-medium p-1">
                <button
                  onClick={() => setImportFormat("text")}
                  className={`px-3 py-1 rounded-material-small text-xs font-medium transition-colors duration-[var(--animate-material-fast)] flex items-center gap-1 ${
                    importFormat === "text"
                      ? "bg-material-primary text-material-text-primary shadow-material-1"
                      : "text-material-text-secondary hover:text-material-text-primary hover:bg-material-surface"
                  }`}
                >
                  <BookOpenText className="w-3 h-3" />
                  Text
                </button>
                <button
                  onClick={() => setImportFormat("file")}
                  className={`px-3 py-1 rounded-material-small text-xs font-medium transition-colors duration-[var(--animate-material-fast)] flex items-center gap-1 ${
                    importFormat === "file"
                      ? "bg-material-primary text-material-text-primary shadow-material-1"
                      : "text-material-text-secondary hover:text-material-text-primary hover:bg-material-surface"
                  }`}
                >
                  <FileJson className="w-3 h-3" />
                  File
                </button>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <button className="px-4 py-2 bg-material-primary text-material-text-primary rounded-material-small">
                Import
              </button>
            </div>

            {/* Import Content */}
            <div className="space-y-4">
              {importFormat === "text" ? (
                <div className="border border-material-border rounded-material-medium overflow-hidden">
                  {/* Text input for importing group */}
                  <textarea
                    className="w-full p-3 bg-material-surface text-material-text-primary text-xs font-mono border-0 focus:outline-none resize-none scrollbar-custom"
                    placeholder="Paste your group data in Markdown or JSON format..."
                    style={{ lineHeight: "1.4" }}
                    rows={12}
                  />
                </div>
              ) : (
                <div className="border border-material-border rounded-material-medium overflow-hidden">
                  {/* File input for importing group */}
                  <input
                    type="file"
                    placeholder="Select a file to import"
                    accept=".json,.md"
                    className="w-full p-2 bg-material-surface border border-material-border rounded-material-small"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportGroupModal;
