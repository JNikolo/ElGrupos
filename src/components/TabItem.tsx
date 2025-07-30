import { ExternalLink, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import CopyButton from "./CopyButton";

interface TabItemProps {
  tab: chrome.tabs.Tab;
  isDragOverlay?: boolean;
  isReordering?: boolean;
}

const TabItem = ({
  tab,
  isDragOverlay = false,
  isReordering = false,
}: TabItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: tab.id || 0,
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-2 border rounded-material-medium transition-colors duration-[var(--animate-material-fast)] shadow-material-1 ${
        isDragging || isDragOverlay
          ? "bg-material-elevated border-material-primary shadow-material-2 opacity-50"
          : "bg-material-surface border-material-border hover:bg-material-elevated"
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          disabled={isReordering}
          className={`flex-shrink-0 mt-0.5 p-0.5 hover:bg-material-elevated rounded-material-small text-material-text-secondary hover:text-material-text-primary transition-all duration-[var(--animate-material-fast)] ${
            isReordering
              ? "cursor-wait opacity-50"
              : "cursor-grab active:cursor-grabbing"
          }`}
          title={isReordering ? "Reordering..." : "Drag to reorder tab"}
        >
          <GripVertical className="w-3 h-3" />
        </button>
        <div className="flex-shrink-0 mt-0.5">
          {tab.favIconUrl ? (
            <img
              src={tab.favIconUrl}
              alt=""
              className="w-4 h-4 rounded-material-small"
            />
          ) : (
            <ExternalLink className="w-4 h-4 text-material-text-disabled" />
          )}
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="font-medium text-material-text-primary text-xs truncate">
            {tab.title || "Untitled Tab"}
          </h3>
          {tab.url && (
            <p className="text-xs text-material-text-secondary truncate mt-0.5">
              {tab.url}
            </p>
          )}
        </div>
        {tab.url && (
          <CopyButton textToCopy={tab.url} id={`tab-${tab.id}`} isIcon />
        )}
      </div>
    </div>
  );
};

export default TabItem;
