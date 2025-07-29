import { useState, useEffect } from "react";
import { Folder, RefreshCw } from "lucide-react";
import Header from "./components/Header";
import TabGroupList from "./components/TabGroupList";
import NoGroupsMessage from "./components/NoGroupsMessage";

function App() {
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);

  const loadTabGroups = async () => {
    try {
      const groups = await chrome.tabGroups.query({});
      setTabGroups(groups);
    } catch (error) {
      console.error("Error loading tab groups:", error);
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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-material-text-primary flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Groups
                <span className="bg-material-primary text-material-text-primary text-xs px-2 py-1 rounded-material-pill">
                  {tabGroups.length}
                </span>
              </h2>
              <button
                onClick={loadTabGroups}
                className="px-3 py-1 bg-material-primary hover:bg-material-primary-dark text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-standard)] text-sm font-medium flex items-center gap-1 shadow-material-1"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>

            {tabGroups.length === 0 ? (
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
