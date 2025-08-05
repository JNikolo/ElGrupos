import Header from "./components/layout/Header";
import GroupsHeader from "./components/groups/GroupsHeader";
import GroupsContent from "./components/groups/GroupsContent";
import ImportModal from "./components/modals/ImportModal";
import GroupEditorModal from "./components/modals/GroupEditorModal";
import ShareGroupModal from "./components/modals/ShareGroupModal";
import { useTabGroups } from "./hooks/useTabGroups";
import { useGroupEditor } from "./hooks/useGroupEditor";
import { useImportModal } from "./hooks/useImportModal";
import { useShareModal } from "./hooks/useShareModal";

function App() {
  // Core tab groups functionality
  const {
    tabGroups,
    loading,
    error,
    loadTabGroups,
    handleCreateGroup,
    handleUpdateGroup,
    handleDeleteGroup,
    handleUngroupTabs,
    handleAddTab,
    handleDuplicateGroup,
    handleImportGroups,
  } = useTabGroups();

  // Group editor modal
  const {
    isOpen: isGroupEditorOpen,
    mode,
    initialData,
    openEditor,
    closeEditor,
    saveGroup,
  } = useGroupEditor({
    onCreateGroup: handleCreateGroup,
    onUpdateGroup: handleUpdateGroup,
  });

  // Import modal state
  const {
    isOpen: isImportOpen,
    openModal: openImportModal,
    closeModal: closeImportModal,
  } = useImportModal();

  // Share modal state
  const {
    shareGroup,
    isOpen: isShareOpen,
    openModal: openShareModal,
    closeModal: closeShareModal,
  } = useShareModal();

  return (
    <div className="w-96 h-[600px] bg-material-dark flex flex-col overflow-hidden">
      <div className="bg-material-surface border border-material-border flex flex-col h-full overflow-hidden shadow-material-2">
        <Header />

        <div className="flex-1 p-4 overflow-y-auto scrollbar-custom">
          <div className="mb-4">
            <GroupsHeader
              groupCount={tabGroups.length}
              loading={loading}
              onRefresh={loadTabGroups}
              onCreateGroup={() => openEditor()}
              onImportGroups={openImportModal}
            />

            <GroupsContent
              tabGroups={tabGroups}
              loading={loading}
              error={error}
              onRetry={loadTabGroups}
              onEditGroup={(group) => openEditor(group)}
              onDeleteGroup={handleDeleteGroup}
              onUngroupTabs={handleUngroupTabs}
              onAddTab={handleAddTab}
              onDuplicateGroup={handleDuplicateGroup}
              onShareGroup={openShareModal}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <ImportModal
        isOpen={isImportOpen}
        onClose={closeImportModal}
        onImport={handleImportGroups}
      />

      <GroupEditorModal
        isOpen={isGroupEditorOpen}
        onClose={closeEditor}
        onSave={saveGroup}
        initialData={initialData}
        mode={mode}
      />

      <ShareGroupModal
        isOpen={isShareOpen}
        onClose={closeShareModal}
        groupId={shareGroup?.id || 0}
      />
    </div>
  );
}

export default App;
