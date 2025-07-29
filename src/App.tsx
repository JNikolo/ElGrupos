import { useState, useEffect } from "react";
import {
  Copy,
  Check,
  ExternalLink,
  Folder,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

function App() {
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  const [openGroups, setOpenGroups] = useState<{
    [groupId: number]: chrome.tabs.Tab[] | null;
  }>({});
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>(
    {}
  );

  useEffect(() => {
    loadTabGroups();
  }, []);

  const loadTabGroups = async () => {
    try {
      const groups = await chrome.tabGroups.query({});
      setTabGroups(groups);
      setOpenGroups({});
    } catch (error) {
      console.error("Error loading tab groups:", error);
    }
  };

  const toggleGroupTabs = async (group: chrome.tabGroups.TabGroup) => {
    if (openGroups[group.id]) {
      setOpenGroups((prev) => {
        const updated = { ...prev };
        delete updated[group.id];
        return updated;
      });
    } else {
      try {
        const groupTabs = await chrome.tabs.query({ groupId: group.id });
        setOpenGroups((prev) => ({
          ...prev,
          [group.id]: groupTabs,
        }));
      } catch (error) {
        console.error("Error loading tabs:", error);
      }
    }
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [key]: false }));
      }, 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const copyTabLink = (tab: chrome.tabs.Tab) => {
    if (tab.url) {
      copyToClipboard(tab.url, `tab-${tab.id}`);
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
    <div className="w-96 h-[600px] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex-shrink-0">
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Folder className="w-5 h-5" />
            Tab Manager
          </h1>
          <p className="text-purple-100 text-sm mt-1">
            Organize and copy your browser tabs
          </p>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 overflow-y-auto scrollbar-custom">
          {/* Tab Groups */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Folder className="w-4 h-4" />
                Groups
                <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                  {tabGroups.length}
                </span>
              </h2>
              <button
                onClick={loadTabGroups}
                className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                Refresh
              </button>
            </div>

            {tabGroups.length === 0 ? (
              <div className="text-center py-6 bg-white/5 rounded-xl border border-white/10">
                <Folder className="w-12 h-12 mx-auto text-gray-400 opacity-50 mb-2" />
                <p className="text-gray-400 text-sm mb-1">
                  No tab groups found
                </p>
                <p className="text-gray-500 text-xs">
                  Create tab groups in Chrome first
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {tabGroups.map((group) => (
                  <div
                    key={group.id}
                    className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                      openGroups[group.id]
                        ? "border-purple-400 bg-purple-500/20 shadow-lg"
                        : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getGroupColor(
                          group.color
                        )}`}
                      />
                      <span className="font-medium text-white text-sm flex-1 truncate">
                        {group.title || "Untitled Group"}
                      </span>
                      <button
                        onClick={() => toggleGroupTabs(group)}
                        className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
                          openGroups[group.id]
                            ? "bg-purple-500 text-white"
                            : "bg-white/10 text-gray-300 hover:bg-white/20"
                        }`}
                      >
                        {openGroups[group.id] ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Collapsible Tabs */}
                    <div
                      className={`transition-all duration-300 overflow-hidden ${
                        openGroups[group.id] ? "max-h-96 mt-3" : "max-h-0"
                      }`}
                    >
                      {openGroups[group.id]?.length ? (
                        <>
                          <div className="flex justify-end mb-2">
                            <button
                              onClick={() => {
                                const links = openGroups[group.id]!.filter(
                                  (tab) => tab.url
                                )
                                  .map(
                                    (tab) =>
                                      `- [${tab.title || "Untitled"}](${
                                        tab.url
                                      })`
                                  )
                                  .join("\n");
                                copyToClipboard(links, `group-${group.id}`);
                              }}
                              className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md font-medium transition-colors ${
                                copiedStates[`group-${group.id}`]
                                  ? "bg-green-600 text-white"
                                  : "bg-green-600 hover:bg-green-700 text-white"
                              }`}
                            >
                              {copiedStates[`group-${group.id}`] ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy All
                                </>
                              )}
                            </button>
                          </div>

                          <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-custom">
                            {openGroups[group.id]?.map((tab) => (
                              <div
                                key={tab.id}
                                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="flex-shrink-0 mt-0.5">
                                    {tab.favIconUrl ? (
                                      <img
                                        src={tab.favIconUrl}
                                        alt=""
                                        className="w-4 h-4 rounded"
                                      />
                                    ) : (
                                      <ExternalLink className="w-4 h-4 text-gray-400" />
                                    )}
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <h3 className="font-medium text-white text-xs truncate">
                                      {tab.title || "Untitled Tab"}
                                    </h3>
                                    {tab.url && (
                                      <p className="text-xs text-gray-400 truncate mt-0.5">
                                        {tab.url}
                                      </p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => copyTabLink(tab)}
                                    className="flex-shrink-0 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
                                    title="Copy link"
                                  >
                                    {copiedStates[`tab-${tab.id}`] ? (
                                      <Check className="w-3 h-3 text-green-400" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-4 bg-white/5 rounded-xl border border-white/10 mt-2">
                          <ExternalLink className="w-8 h-8 mx-auto text-gray-400 opacity-50 mb-2" />
                          <p className="text-gray-400 text-sm">
                            No tabs in this group
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
