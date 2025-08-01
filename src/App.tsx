import { useState } from "react";
import { Folder, RefreshCw, Plus } from "lucide-react";
import Header from "./components/Header";
import TabGroupList from "./components/TabGroupList";
import NoGroupsMessage from "./components/NoGroupsMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import Tooltip from "./components/Tooltip";
import GroupEditor from "./components/GroupEditor";
import { useTabGroups } from "./hooks/useTabGroups";

function App() {
  const {
    tabGroups,
    loading,
    error,
    loadTabGroups,
    handleDeleteGroup,
    handleUngroupTabs,
    handleAddTab,
    handleDuplicateGroup,
  } = useTabGroups();
  const [isGroupEditorOpen, setIsGroupEditorOpen] = useState(false);
  const [editingGroup, setEditingGroup] =
    useState<chrome.tabGroups.TabGroup | null>(null);

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsGroupEditorOpen(true);
  };

  const handleEditGroup = (group: chrome.tabGroups.TabGroup) => {
    setEditingGroup(group);
    setIsGroupEditorOpen(true);
  };

  const handleGroupSave = async (groupData: {
    title: string;
    color: string;
  }) => {
    try {
      if (editingGroup) {
        // Update existing group
        await chrome.tabGroups.update(editingGroup.id, {
          title: groupData.title,
          color: groupData.color as
            | "blue"
            | "cyan"
            | "green"
            | "grey"
            | "orange"
            | "pink"
            | "purple"
            | "red"
            | "yellow",
        });
        console.log("Updated group:", editingGroup.id, groupData);
      } else {
        // Create new group with current active tab
        const activeTabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });
        if (activeTabs.length > 0 && activeTabs[0].id) {
          const groupId = await chrome.tabs.group({
            tabIds: [activeTabs[0].id],
          });
          await chrome.tabGroups.update(groupId, {
            title: groupData.title,
            color: groupData.color as
              | "blue"
              | "cyan"
              | "green"
              | "grey"
              | "orange"
              | "pink"
              | "purple"
              | "red"
              | "yellow",
          });
          console.log("Created new group:", groupId, groupData);
        } else {
          throw new Error("No active tab found to create group");
        }
      }

      // Refresh the groups list to show updated data
      await loadTabGroups();
    } catch (error) {
      console.error("Error saving group:", error);
    } finally {
      setIsGroupEditorOpen(false);
      setEditingGroup(null);
    }
  };

  const handleGroupEditorClose = () => {
    setIsGroupEditorOpen(false);
    setEditingGroup(null);
  };

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
              <div className="flex items-center gap-2">
                <Tooltip content="Create new group">
                  <button
                    onClick={handleCreateGroup}
                    className="px-3 py-1 bg-material-secondary hover:bg-material-secondary-dark text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-standard)] text-sm font-medium flex items-center gap-1 shadow-material-1"
                  >
                    <Plus className="w-3 h-3" />
                    Create
                  </button>
                </Tooltip>
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
            </div>

            {loading ? (
              <LoadingSpinner message="Loading tab groups..." />
            ) : error ? (
              <ErrorMessage message={error} onRetry={loadTabGroups} />
            ) : tabGroups.length === 0 ? (
              <NoGroupsMessage />
            ) : (
              <TabGroupList
                tabGroups={tabGroups}
                onEditGroup={handleEditGroup}
                onDeleteGroup={handleDeleteGroup}
                onUngroupTabs={handleUngroupTabs}
                onAddTab={handleAddTab}
                onDuplicate={handleDuplicateGroup}
              />
            )}
          </div>
        </div>
      </div>

      {/* Group Editor Modal */}
      <GroupEditor
        isOpen={isGroupEditorOpen}
        onClose={handleGroupEditorClose}
        onSave={handleGroupSave}
        initialData={
          editingGroup
            ? { title: editingGroup.title || "", color: editingGroup.color }
            : undefined
        }
        mode={editingGroup ? "edit" : "create"}
      />
    </div>
  );
}

export default App;
