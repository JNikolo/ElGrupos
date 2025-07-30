import { useState } from "react";
import { ExternalLink, Share2 } from "lucide-react";
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
import TabItem from "./TabItem";
import CopyButton from "./CopyButton";
import Tooltip from "./Tooltip";
import { reorderTabsInGroup } from "../utils/tabUtils";

interface TabListProps {
  tabs: chrome.tabs.Tab[];
  groupId: number;
  onTabsReorder?: (newTabs: chrome.tabs.Tab[]) => void;
}

const TabList = ({ tabs, groupId, onTabsReorder }: TabListProps) => {
  const [localTabs, setLocalTabs] = useState(tabs);
  const [activeTab, setActiveTab] = useState<chrome.tabs.Tab | null>(null);
  const [isReordering, setIsReordering] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const tab = localTabs.find((tab) => tab.id === active.id);
    setActiveTab(tab || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localTabs.findIndex((tab) => tab.id === active.id);
      const newIndex = localTabs.findIndex((tab) => tab.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        // Optimistically update the UI
        const newTabs = arrayMove(localTabs, oldIndex, newIndex);
        setLocalTabs(newTabs);
        setIsReordering(true);

        try {
          // Update Chrome tab order
          const updatedTabs = await reorderTabsInGroup(
            groupId,
            oldIndex,
            newIndex
          );
          setLocalTabs(updatedTabs);
          onTabsReorder?.(updatedTabs);
        } catch (error) {
          console.error("Failed to reorder tabs:", error);
          // Revert to original order on error
          setLocalTabs(tabs);
        } finally {
          setIsReordering(false);
        }
      }
    }

    setActiveTab(null);
  };

  // Update local tabs when props change
  if (tabs !== localTabs && !isReordering) {
    setLocalTabs(tabs);
  }

  if (!localTabs.length) {
    return (
      <div className="text-center py-4 bg-material-surface rounded-material-medium border border-material-border mt-2 shadow-material-1">
        <ExternalLink className="w-8 h-8 mx-auto text-material-text-disabled mb-2" />
        <p className="text-material-text-secondary text-sm">
          No tabs in this group
        </p>
      </div>
    );
  }

  const allLinks = localTabs
    .filter((tab) => tab.url)
    .map((tab) => `- [${tab.title || "Untitled"}](${tab.url})`)
    .join("\n");

  return (
    <>
      <div className="flex justify-end items-center gap-2 mb-2">
        <Tooltip content="Share all links in one URL">
          <button
            onClick={() => {
              // Share functionality will be implemented later
              console.log("Share all links:", allLinks);
            }}
            className="px-2 py-1 bg-material-info hover:bg-blue-600 text-material-text-primary rounded-material-small transition-colors duration-[var(--animate-material-fast)] text-xs font-medium flex items-center gap-1 shadow-material-1"
          >
            <Share2 className="w-3 h-3" />
            Share
          </button>
        </Tooltip>
        <CopyButton textToCopy={allLinks} id={`group-${groupId}`} />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className={`space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-custom ${
            isReordering ? "opacity-70 pointer-events-none" : ""
          }`}
        >
          <SortableContext
            items={localTabs.map((tab) => tab.id || 0)}
            strategy={verticalListSortingStrategy}
          >
            {localTabs.map((tab) => (
              <TabItem key={tab.id} tab={tab} isReordering={isReordering} />
            ))}
          </SortableContext>
        </div>

        <DragOverlay>
          {activeTab ? <TabItem tab={activeTab} isDragOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

export default TabList;
