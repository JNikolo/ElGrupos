import { useState, useEffect } from "react";
import { Folder, RefreshCw, Plus } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Header from "./components/Header";
import TabGroupList from "./components/TabGroupList";
import TabGroup from "./components/TabGroup";
import NoGroupsMessage from "./components/NoGroupsMessage";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import Tooltip from "./components/Tooltip";
import SearchComponent from "./components/SearchComponent";
import GroupEditor from "./components/GroupEditor";
import { reorderTabGroups, getSortedTabGroups } from "./utils/tabUtils";

function App() {
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGroupEditorOpen, setIsGroupEditorOpen] = useState(false);
  const [editingGroup, setEditingGroup] =
    useState<chrome.tabGroups.TabGroup | null>(null);
  const [activeGroup, setActiveGroup] =
    useState<chrome.tabGroups.TabGroup | null>(null);
  const [isReorderingGroups, setIsReorderingGroups] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const group = tabGroups.find((group) => group.id === active.id);
    setActiveGroup(group || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tabGroups.findIndex((group) => group.id === active.id);
      const newIndex = tabGroups.findIndex((group) => group.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Optimistically update the UI
        const newGroups = arrayMove(tabGroups, oldIndex, newIndex);
        setTabGroups(newGroups);
        setIsReorderingGroups(true);

        try {
          // Update Chrome tab group order
          const updatedGroups = await reorderTabGroups(
            tabGroups,
            oldIndex,
            newIndex
          );
          setTabGroups(updatedGroups);
        } catch (error) {
          console.error("Failed to reorder tab groups:", error);
          // Revert to original order on error
          setTabGroups(tabGroups);
        } finally {
          setIsReorderingGroups(false);
        }
      }
    }

    setActiveGroup(null);
  };

  const loadTabGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const groups = await getSortedTabGroups();
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

  const handleCreateGroup = () => {
    setEditingGroup(null);
    setIsGroupEditorOpen(true);
  };

  const handleGroupSave = (groupData: { title: string; color: string }) => {
    // Group save functionality will be implemented later
    console.log("Save group:", groupData);
    setIsGroupEditorOpen(false);
    setEditingGroup(null);
  };

  const handleGroupEditorClose = () => {
    setIsGroupEditorOpen(false);
    setEditingGroup(null);
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
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={tabGroups.map((group) => group.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <TabGroupList
                    tabGroups={tabGroups}
                    isReordering={isReorderingGroups}
                  />
                </SortableContext>
                <DragOverlay>
                  {activeGroup ? <TabGroup group={activeGroup} /> : null}
                </DragOverlay>
              </DndContext>
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
