import { Folder, RefreshCw, Plus } from "lucide-react";
import Header from "./components/Header";
import TabGroupList from "./components/TabGroupList";
import NoGroupsMessage from "./components/NoGroupsMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import Tooltip from "./components/Tooltip";
import GroupEditor from "./components/GroupEditor";
import { useTabGroups } from "./hooks/useTabGroups";
import { useGroupEditor } from "./hooks/useGroupEditor";

function App() {
  // Get tab groups operations
  const {
    tabGroups,
    loading,
    error,
    loadTabGroups,
    handleCreateGroup, // NEW: For creating groups
    handleUpdateGroup, // NEW: For updating groups
    handleDeleteGroup,
    handleUngroupTabs,
    handleAddTab,
    handleDuplicateGroup,
  } = useTabGroups();

  // Get group editor operations that delegate to useTabGroups
  const {
    isOpen: isGroupEditorOpen,
    mode,
    initialData,
    openEditor,
    closeEditor,
    saveGroup,
  } = useGroupEditor({
    onCreateGroup: handleCreateGroup, // Delegate create to useTabGroups
    onUpdateGroup: handleUpdateGroup, // Delegate update to useTabGroups
  });

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
                    onClick={() => openEditor()}
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
                onEditGroup={(group) => openEditor(group)}
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
        onClose={closeEditor}
        onSave={saveGroup}
        initialData={initialData}
        mode={mode}
      />
    </div>
  );
}

export default App;
