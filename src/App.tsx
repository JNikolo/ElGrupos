import { useState, useEffect } from "react";
import { Folder, RefreshCw } from "lucide-react";
import Header from "./components/Header";
import TabGroupList from "./components/TabGroupList";
import NoGroupsMessage from "./components/NoGroupsMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import Tooltip from "./components/Tooltip";
import SearchComponent from "./components/SearchComponent";

function App() {
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTabGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const groups = await chrome.tabGroups.query({});
      setTabGroups(groups);
    } catch (error) {
      console.error("Error loading tab groups:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load tab groups"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTabGroups();
  }, []);

  return (
    <div className="w-96 h-[600px] bg-material-dark flex flex-col overflow-hidden">
      <div className="bg-material-surface border border-material-border flex flex-col h-full overflow-hidden shadow-material-2">
        <Header />

        <div className="flex-1 p-4 overflow-y-auto scrollbar-custom">
          <div className="mb-4">
            {/* Search Component */}
            <div className="mb-4">
              <SearchComponent
                placeholder="Search tabs and groups..."
                onSearch={(query) => {
                  // Search functionality will be implemented later
                  console.log("Search query:", query);
                }}
                onClear={() => {
                  // Clear functionality will be implemented later
                  console.log("Search cleared");
                }}
              />
            </div>

            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-material-text-primary flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Groups
                <span className="bg-material-primary text-material-text-primary text-xs px-2 py-1 rounded-material-pill">
                  {tabGroups.length}
                </span>
              </h2>
              <Tooltip content="Refresh tab groups">
                <button
                  onClick={loadTabGroups}
                  disabled={loading}
                  className={`px-3 py-1 bg-material-primary hover:bg-material-primary-dark text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-standard)] text-sm font-medium flex items-center gap-1 shadow-material-1 ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <RefreshCw
                    className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
              </Tooltip>
            </div>

            {loading ? (
              <LoadingSpinner message="Loading tab groups..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={loadTabGroups} />
            ) : tabGroups.length === 0 ? (
              <NoGroupsMessage />
            ) : (
              <TabGroupList tabGroups={tabGroups} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
