import {
  Share2,
  Copy,
  Download,
  FileText,
  Code,
  Eye,
  Check,
} from "lucide-react";
import LoadingSpinner from "../ui/LoadingSpinner";
import { useShareGroup } from "../../hooks/useShareGroup";
import Modal from "../ui/Modal";

interface ShareGroupModalProps {
  groupId: number;
  handleClose: () => void;
}

const ShareGroup = ({ handleClose, groupId }: ShareGroupModalProps) => {
  const {
    title,
    error,
    loading,
    exportFormat,
    showPreview,
    actionStates,
    setExportFormat,
    setShowPreview,
    handleCopyToClipboard,
    handleDownloadFile,
    getCurrentExportData,
    getPreviewTitle,
    getValidTabsCount,
  } = useShareGroup({ groupId });

  return (
    <Modal
      handleClose={handleClose}
      loading={loading}
      icon={<Share2 className="w-5 h-5" />}
      title={`Share Group ${title || "Untitled Group"}`}
    >
      {/* Content */}
      <div className="space-y-4">
        {/* Export Format Toggle */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-material-text-secondary">
            Export as:
          </span>
          <div className="flex bg-material-elevated rounded-material-medium p-1">
            <button
              onClick={() => setExportFormat("markdown")}
              className={`px-3 py-1 rounded-material-small text-xs font-medium transition-colors duration-[var(--animate-material-fast)] flex items-center gap-1 ${
                exportFormat === "markdown"
                  ? "bg-material-primary text-material-text-primary shadow-material-1"
                  : "text-material-text-secondary hover:text-material-text-primary hover:bg-material-surface"
              }`}
            >
              <FileText className="w-3 h-3" />
              Markdown
            </button>
            <button
              onClick={() => setExportFormat("json")}
              className={`px-3 py-1 rounded-material-small text-xs font-medium transition-colors duration-[var(--animate-material-fast)] flex items-center gap-1 ${
                exportFormat === "json"
                  ? "bg-material-primary text-material-text-primary shadow-material-1"
                  : "text-material-text-secondary hover:text-material-text-primary hover:bg-material-surface"
              }`}
            >
              <Code className="w-3 h-3" />
              JSON
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCopyToClipboard}
            disabled={loading || error || actionStates.copying}
            className={`flex-1 p-3 rounded-material-medium transition-colors duration-[var(--animate-material-fast)] font-medium text-sm flex items-center justify-center gap-2 shadow-material-1 ${
              loading || error
                ? "bg-material-border text-material-text-disabled cursor-not-allowed"
                : actionStates.copying
                ? "bg-material-success text-material-text-primary"
                : "bg-material-primary hover:bg-material-primary-dark text-material-text-primary"
            }`}
          >
            {actionStates.copying ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            {actionStates.copying ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownloadFile}
            disabled={loading || error || actionStates.downloading}
            className={`flex-1 p-3 rounded-material-medium transition-colors duration-[var(--animate-material-fast)] font-medium text-sm flex items-center justify-center gap-2 shadow-material-1 ${
              loading || error
                ? "bg-material-border text-material-text-disabled cursor-not-allowed"
                : actionStates.downloading
                ? "bg-material-success text-material-text-primary"
                : "bg-material-secondary hover:bg-material-secondary-dark text-material-text-primary"
            }`}
          >
            {actionStates.downloading ? (
              <Check className="w-4 h-4" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {actionStates.downloading ? "Downloaded!" : "Download"}
          </button>
        </div>

        {/* Preview Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-material-text-secondary">
            Preview:
          </span>
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-3 py-1 rounded-material-small text-xs font-medium transition-colors duration-[var(--animate-material-fast)] flex items-center gap-1 ${
              showPreview
                ? "bg-material-info text-material-text-primary"
                : "bg-material-border text-material-text-secondary hover:bg-material-elevated"
            }`}
          >
            <Eye className="w-3 h-3" />
            {showPreview ? "Hide" : "Show"}
          </button>
        </div>

        {/* Preview Area */}
        {showPreview && (
          <div className="border border-material-border rounded-material-medium overflow-hidden">
            <div className="bg-material-elevated px-3 py-2 border-b border-material-border">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-material-text-secondary">
                  {getPreviewTitle()}
                </span>
                <span className="text-xs text-material-text-disabled">
                  {getValidTabsCount()} tabs
                </span>
              </div>
            </div>
            {error ? (
              <div className="p-4 text-center">
                <p className="text-material-error text-sm mb-2">
                  Failed to load group data
                </p>
                <p className="text-material-text-disabled text-xs">
                  Please try closing and reopening this modal
                </p>
              </div>
            ) : loading ? (
              <div className="p-4 text-center">
                <LoadingSpinner size="sm" message="Loading tabs..." />
              </div>
            ) : (
              <textarea
                className="w-full p-3 bg-material-surface text-material-text-primary text-xs font-mono border-0 focus:outline-none resize-none scrollbar-custom"
                value={getCurrentExportData()}
                readOnly
                rows={12}
                style={{ lineHeight: "1.4" }}
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
export default ShareGroup;
