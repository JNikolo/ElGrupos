import { Folder, RefreshCw, Plus, Import } from "lucide-react";
import Header from "./components/Header";
import TabGroupList from "./components/TabGroupList";
import NoGroupsMessage from "./components/NoGroupsMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import Tooltip from "./components/Tooltip";
import GroupEditor from "./components/GroupEditor";
import ShareGroupModal from "./components/ShareGroupModal";
import { useTabGroups } from "./hooks/useTabGroups";
import { useGroupEditor } from "./hooks/useGroupEditor";
import ImportGroupModal from "./components/ImportGroupModal";
import { useState } from "react";

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
    handleImportGroups, // NEW: For importing groups
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

  const [isGroupImportOpen, setIsGroupImportOpen] = useState(false);
  const openImportModal = () => {
    setIsGroupImportOpen(true);
  };
  const closeImportModal = () => {
    setIsGroupImportOpen(false);
  };

  const [shareGroup, setShareGroup] =
    useState<chrome.tabGroups.TabGroup | null>(null);
  const openShareModal = (group: chrome.tabGroups.TabGroup) => {
    setShareGroup(group);
  };
  const closeShareModal = () => {
    setShareGroup(null);
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
                <Tooltip content="Import tab groups">
                  <button
                    onClick={() => openImportModal()}
                    className="px-2 py-1 bg-material-secondary hover:bg-material-secondary-dark text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-standard)] text-sm font-medium flex items-center gap-1 shadow-material-1"
                  >
                    <Import className="w-3 h-3" />
                    Import
                  </button>
                </Tooltip>
                {isGroupImportOpen && (
                  <ImportGroupModal
                    handleClose={closeImportModal}
                    onImport={async (data) => {
                      try {
                        await handleImportGroups(data);
                        // Small delay to show success before closing
                        setTimeout(() => {
                          closeImportModal();
                        }, 500);
                      } catch (error) {
                        // Error handling is done in the hook, modal will stay open
                        console.error("Import failed:", error);
                      }
                    }}
                  />
                )}
                <Tooltip content="Create new group">
                  <button
                    onClick={() => openEditor()}
                    className="px-2 py-1 bg-material-secondary hover:bg-material-secondary-dark text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-standard)] text-sm font-medium flex items-center gap-1 shadow-material-1"
                  >
                    <Plus className="w-3 h-3" />
                    Create
                  </button>
                </Tooltip>
                <Tooltip content="Refresh tab groups">
                  <button
                    onClick={loadTabGroups}
                    disabled={loading}
                    className={`px-2 py-1 text-material-primary hover:text-material-primary-dark text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-standard)] text-sm font-medium flex items-center gap-1 ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                    />
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
                onShareGroup={openShareModal}
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

      {/* Share Group Modal */}
      {shareGroup && (
        <ShareGroupModal
          groupId={shareGroup.id}
          handleClose={closeShareModal}
        />
      )}
    </div>
  );
}

export default App;
