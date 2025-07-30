import { useState } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TabList from "./TabList";
import { getGroupColor } from "../utils/colorUtils";
import LoadingSpinner from "./LoadingSpinner";
import GroupActions from "./GroupActions";

interface TabGroupProps {
  group: chrome.tabGroups.TabGroup;
  isReordering?: boolean;
}

const TabGroup = ({ group, isReordering = false }: TabGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleTabsReorder = (newTabs: chrome.tabs.Tab[]) => {
    setTabs(newTabs);
  };

  const toggleGroupTabs = async () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setLoading(true);
      try {
        const groupTabs = await chrome.tabs.query({ groupId: group.id });
        setTabs(groupTabs);
        setIsOpen(true);
      } catch (error) {
        console.error("Error loading tabs:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-3 rounded-material-medium border-2 transition-all duration-[var(--animate-material-standard)] ${
        isDragging
          ? "border-material-primary bg-material-elevated shadow-material-4 opacity-50"
          : isOpen
          ? "border-material-primary bg-material-elevated shadow-material-4"
          : "border-material-border bg-material-surface hover:border-material-primary hover:bg-material-elevated shadow-material-1"
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          disabled={isReordering}
          className={`p-1 hover:rounded-material-small hover:bg-material-elevated text-material-text-secondary hover:text-material-text-primary transition-all duration-[var(--animate-material-fast)] hover:shadow-material-2 ${
            isReordering
              ? "cursor-wait opacity-50"
              : "cursor-grab active:cursor-grabbing"
          }`}
          title={isReordering ? "Reordering groups..." : "Drag to reorder"}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <div className={`w-3 h-3 rounded-full ${getGroupColor(group.color)}`} />
        <span className="font-medium text-material-text-primary text-sm flex-1 truncate">
          {group.title || "Untitled Group"}
        </span>

        {/* Group Actions */}
        <GroupActions
          groupId={group.id}
          groupTitle={group.title || "Untitled Group"}
          onEdit={() => {
            // Edit functionality will be implemented later
            console.log("Edit group:", group.id);
          }}
          onDelete={() => {
            // Delete functionality will be implemented later
            console.log("Delete group:", group.id);
          }}
          onDuplicate={() => {
            // Duplicate functionality will be implemented later
            console.log("Duplicate group:", group.id);
          }}
          onArchive={() => {
            // Archive functionality will be implemented later
            console.log("Archive group:", group.id);
          }}
          onAddTab={() => {
            // Add tab functionality will be implemented later
            console.log("Add tab to group:", group.id);
          }}
        />

        <button
          onClick={toggleGroupTabs}
          className={`px-2 py-1 rounded-material-small text-xs font-medium transition-colors duration-[var(--animate-material-fast)] ${
            isOpen
              ? "bg-material-primary text-material-text-primary shadow-material-1"
              : "bg-material-border text-material-text-secondary hover:bg-material-elevated"
          }`}
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      <div
        className={`transition-all duration-[var(--animate-material-slow)] overflow-hidden ${
          isOpen ? "max-h-96 mt-3" : "max-h-0"
        }`}
      >
        {isOpen &&
          (loading ? (
            <LoadingSpinner message="Loading tabs..." />
          ) : (
            <TabList
              tabs={tabs}
              groupId={group.id}
              onTabsReorder={handleTabsReorder}
            />
          ))}
      </div>
    </div>
  );
};

export default TabGroup;
