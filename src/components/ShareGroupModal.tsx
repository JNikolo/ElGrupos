import { useState, useEffect } from "react";
import { chromeAPI } from "../services/chromeAPI";
import {
  Edit3,
  X,
  Copy,
  Download,
  FileText,
  Code,
  Eye,
  Check,
} from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";

interface ShareGroupModalProps {
  groupId: number;
  handleClose: () => void;
}

const ShareGroupModal = ({ handleClose, groupId }: ShareGroupModalProps) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<"markdown" | "json">(
    "markdown"
  );
  const [showPreview, setShowPreview] = useState(true);
  const [actionStates, setActionStates] = useState({
    copying: false,
    downloading: false,
  });

  useEffect(() => {
    const loadGroupData = async () => {
      setLoading(true);
      setError(false);
      try {
        const group = await chromeAPI.getTabGroup(groupId);
        setTitle(group.title || "Untitled Group");
        const groupTabs = await chromeAPI.getTabsInGroup(groupId);
        setTabs(groupTabs);
      } catch (error) {
        console.error("Error loading group data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadGroupData();
  }, [groupId]);

  const getMarkdownExport = () => {
    return tabs
      .filter((tab) => tab.url)
      .map((tab) => `- [${tab.title || "Untitled"}](${tab.url})`)
      .join("\n");
  };

  const getJsonExport = () => {
    const exportData = {
      groupTitle: title,
      exportedAt: new Date().toISOString(),
      tabs: tabs
        .filter((tab) => tab.url)
        .map((tab) => ({
          title: tab.title || "Untitled",
          url: tab.url,
          favIconUrl: tab.favIconUrl || null,
        })),
    };
    return JSON.stringify(exportData, null, 2);
  };

  const getCurrentExportData = () => {
    return exportFormat === "markdown" ? getMarkdownExport() : getJsonExport();
  };

  const handleCopyToClipboard = async () => {
    if (actionStates.copying) return;

    setActionStates((prev) => ({ ...prev, copying: true }));
    try {
      await navigator.clipboard.writeText(getCurrentExportData());
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    } finally {
      setTimeout(() => {
        setActionStates((prev) => ({ ...prev, copying: false }));
      }, 2000);
    }
  };

  const handleDownloadFile = () => {
    if (actionStates.downloading) return;

    setActionStates((prev) => ({ ...prev, downloading: true }));
    try {
      const data = getCurrentExportData();
      const filename = `${title || "tab-group"}.${
        exportFormat === "markdown" ? "md" : "json"
      }`;
      const blob = new Blob([data], {
        type:
          exportFormat === "markdown" ? "text/markdown" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download file:", error);
    } finally {
      setTimeout(() => {
        setActionStates((prev) => ({ ...prev, downloading: false }));
      }, 2000);
    }
  };

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
                    Share Group {title || "Untitled Group"}
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
                      {exportFormat === "markdown"
                        ? "Markdown Preview"
                        : "JSON Preview"}
                    </span>
                    <span className="text-xs text-material-text-disabled">
                      {tabs.filter((tab) => tab.url).length} tabs
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
        </div>
      </div>
    </div>
  );
};
export default ShareGroupModal;
