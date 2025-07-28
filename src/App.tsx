import { useState, useEffect } from "react";
import { ExternalLink, Folder } from "lucide-react";

function App() {
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [selectedGroup, setSelectedGroup] =
    useState<chrome.tabGroups.TabGroup | null>(null);

  useEffect(() => {
    // Auto-load tab groups on component mount
    loadTabGroups();
  }, []);

  const loadTabGroups = async () => {
    try {
      const groups = await chrome.tabGroups.query({});
      setTabGroups(groups);
    } catch (error) {
      console.error("Error loading tab groups:", error);
    }
  };

  const loadTabsForGroup = async (group: chrome.tabGroups.TabGroup) => {
    try {
      const groupTabs = await chrome.tabs.query({ groupId: group.id });
      setTabs(groupTabs);
      setSelectedGroup(group);
    } catch (error) {
      console.error("Error loading tabs:", error);
    }
  };

  const getGroupColor = (color: string) => {
    const colorMap: { [key: string]: string } = {
      grey: "bg-gray-500",
      blue: "bg-blue-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
      pink: "bg-pink-500",
      purple: "bg-purple-500",
      cyan: "bg-cyan-500",
      orange: "bg-orange-500",
    };
    return colorMap[color] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Folder className="w-8 h-8" />
              Tab Manager
            </h1>
            <p className="text-purple-100 mt-2">
              View and organize your browser tab groups
            </p>
          </div>

          <div className="p-6">
            {/* Tab Groups Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Folder className="w-5 h-5" />
                  Tab Groups ({tabGroups.length})
                </h2>
                <button
                  onClick={loadTabGroups}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                >
                  Refresh Groups
                </button>
              </div>

              {tabGroups.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Folder className="w-16 h-16 mx-auto opacity-50" />
                  </div>
                  <p className="text-gray-400">No tab groups found</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Create some tab groups in Chrome to get started
                  </p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {tabGroups.map((group) => (
                    <button
                      key={group.id}
                      onClick={() => loadTabsForGroup(group)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:scale-[1.02] ${
                        selectedGroup?.id === group.id
                          ? "border-purple-400 bg-purple-500/20 shadow-lg"
                          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-full ${getGroupColor(
                            group.color
                          )}`}
                        ></div>
                        <span className="font-medium text-white">
                          {group.title || "Untitled Group"}
                        </span>
                        <span className="text-sm text-gray-400 ml-auto">
                          Click to view tabs
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Tabs Section */}
            {selectedGroup && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                    <ExternalLink className="w-5 h-5" />
                    Tabs in "{selectedGroup.title || "Untitled Group"}" (
                    {tabs.length})
                  </h2>
                </div>

                {tabs.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                      <ExternalLink className="w-16 h-16 mx-auto opacity-50" />
                    </div>
                    <p className="text-gray-400">No tabs in this group</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tabs.map((tab) => (
                      <div
                        key={tab.id}
                        className="p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors duration-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {tab.favIconUrl ? (
                              <img
                                src={tab.favIconUrl}
                                alt=""
                                className="w-5 h-5 rounded"
                              />
                            ) : (
                              <ExternalLink className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-medium text-white truncate">
                              {tab.title || "Untitled Tab"}
                            </h3>
                            {tab.url && (
                              <p className="text-sm text-gray-400 truncate mt-1">
                                {tab.url}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
