import { useState } from "react";
import { MoreVertical, Edit3, Trash2, Plus, Copy, Ungroup } from "lucide-react";
import Tooltip from "./Tooltip";

interface GroupActionsProps {
  groupId: number;
  groupTitle: string;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onUngroup: () => void;
  onAddTab: () => void;
}

const GroupActions = ({
  groupId,
  groupTitle,
  onEdit,
  onDelete,
  onDuplicate,
  onUngroup,
  onAddTab,
}: GroupActionsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    {
      icon: Edit3,
      label: "Edit Group",
      onClick: () => {
        onEdit();
        setIsOpen(false);
      },
      variant: "default" as const,
    },
    {
      icon: Plus,
      label: "Add Current Tab",
      onClick: () => {
        onAddTab();
        setIsOpen(false);
      },
      variant: "default" as const,
    },
    {
      icon: Copy,
      label: "Duplicate Group",
      onClick: () => {
        onDuplicate();
        setIsOpen(false);
      },
      variant: "default" as const,
    },
    {
      icon: Ungroup,
      label: "Ungroup Tabs",
      onClick: () => {
        onUngroup();
        setIsOpen(false);
      },
      variant: "warning" as const,
    },
    {
      icon: Trash2,
      label: "Delete Group",
      onClick: () => {
        onDelete();
        setIsOpen(false);
      },
      variant: "danger" as const,
    },
  ];

  const getVariantStyles = (variant: "default" | "warning" | "danger") => {
    switch (variant) {
      case "warning":
        return "text-material-warning hover:bg-material-warning hover:text-material-text-primary";
      case "danger":
        return "text-material-error hover:bg-material-error hover:text-material-text-primary";
      default:
        return "text-material-text-primary hover:bg-material-elevated";
    }
  };

  return (
    <div className="relative" key={groupId}>
      <Tooltip content="Group actions">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(!isOpen);
          }}
          className={`flex-shrink-0 p-1 rounded-material-small transition-colors duration-[var(--animate-material-fast)] ${
            isOpen
              ? "bg-material-elevated text-material-text-primary"
              : "text-material-text-secondary hover:text-material-text-primary hover:bg-material-elevated"
          }`}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </Tooltip>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="absolute right-0 top-full mt-1 bg-material-surface border border-material-border rounded-material-medium shadow-material-8 py-1 min-w-48 z-50">
            <div className="px-3 py-2 border-b border-material-divider">
              <p className="text-xs font-medium text-material-text-secondary truncate">
                {groupTitle || "Untitled Group"}
              </p>
            </div>

            {actions.map((action, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors duration-[var(--animate-material-fast)] ${getVariantStyles(
                  action.variant
                )}`}
              >
                <action.icon className="w-4 h-4 flex-shrink-0" />
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GroupActions;
