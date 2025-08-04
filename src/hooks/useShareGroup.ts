import { useState, useEffect } from "react";
import { chromeAPI } from "../services/chromeAPI";

export type ExportFormat = "markdown" | "json";

interface UseShareGroupOptions {
  groupId: number;
}

export const useShareGroup = ({ groupId }: UseShareGroupOptions) => {
  const [title, setTitle] = useState("");
  const [error, setError] = useState(false);
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [loading, setLoading] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("markdown");
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
    switch (exportFormat) {
      case "markdown":
        return getMarkdownExport();
      case "json":
        return getJsonExport();
      default:
        return getMarkdownExport();
    }
  };

  const handleCopyToClipboard = async () => {
    if (actionStates.copying) return;

    setActionStates((prev) => ({ ...prev, copying: true }));
    try {
      await navigator.clipboard.writeText(getCurrentExportData());
      return true; // Success
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      return false; // Failure
    } finally {
      setTimeout(() => {
        setActionStates((prev) => ({ ...prev, copying: false }));
      }, 2000);
    }
  };

  const handleDownloadFile = () => {
    if (actionStates.downloading) return false;

    setActionStates((prev) => ({ ...prev, downloading: true }));
    try {
      const data = getCurrentExportData();

      let filename: string;
      let mimeType: string;

      switch (exportFormat) {
        case "json":
          filename = `${title || "tab-group"}.json`;
          mimeType = "application/json";
          break;
        case "markdown":
        default:
          filename = `${title || "tab-group"}.md`;
          mimeType = "text/markdown";
          break;
      }

      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      return { success: true, filename }; // Success with filename
    } catch (error) {
      console.error("Failed to download file:", error);
      return { success: false }; // Failure
    } finally {
      setTimeout(() => {
        setActionStates((prev) => ({ ...prev, downloading: false }));
      }, 2000);
    }
  };

  const getPreviewTitle = () => {
    switch (exportFormat) {
      case "markdown":
        return "Markdown Preview";
      case "json":
        return "JSON Preview";
      default:
        return "Preview";
    }
  };

  const getValidTabsCount = () => {
    return tabs.filter((tab) => tab.url).length;
  };

  return {
    // State
    title,
    error,
    tabs,
    loading,
    exportFormat,
    showPreview,
    actionStates,

    // Actions
    setExportFormat,
    setShowPreview,
    handleCopyToClipboard,
    handleDownloadFile,

    // Computed values
    getCurrentExportData,
    getPreviewTitle,
    getValidTabsCount,
  };
};
