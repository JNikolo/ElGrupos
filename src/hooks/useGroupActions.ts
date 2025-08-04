import { useCallback } from "react";
import { Edit3, Plus, Copy, Ungroup, Trash2, Share2 } from "lucide-react";

export interface GroupAction {
  icon: typeof Edit3;
  label: string;
  onClick: () => void;
  variant: "default" | "warning" | "danger";
}

interface UseGroupActionsProps {
  onEdit: () => void;
  onDelete: () => Promise<void>;
  onDuplicate: () => Promise<void>;
  onUngroup: () => Promise<void>;
  onAddTab: () => Promise<void>;
  onShare: () => void;
}

export const useGroupActions = ({
  onEdit,
  onDelete,
  onDuplicate,
  onUngroup,
  onAddTab,
  onShare,
}: UseGroupActionsProps) => {
  const handleEdit = useCallback(() => {
    onEdit();
  }, [onEdit]);

  const handleShare = useCallback(() => {
    onShare();
  }, [onShare]);

  const handleAddTab = useCallback(async () => {
    try {
      await onAddTab();
    } catch (error) {
      console.error("Failed to add tab to group:", error);
    }
  }, [onAddTab]);

  const handleDuplicate = useCallback(async () => {
    try {
      await onDuplicate();
    } catch (error) {
      console.error("Failed to duplicate group:", error);
    }
  }, [onDuplicate]);

  const handleUngroup = useCallback(async () => {
    try {
      await onUngroup();
    } catch (error) {
      console.error("Failed to ungroup tabs:", error);
    }
  }, [onUngroup]);

  const handleDelete = useCallback(async () => {
    try {
      await onDelete();
    } catch (error) {
      console.error("Failed to delete group:", error);
    }
  }, [onDelete]);

  const actions: GroupAction[] = [
    {
      icon: Edit3,
      label: "Edit Group",
      onClick: handleEdit,
      variant: "default",
    },
    {
      icon: Share2,
      label: "Share Group",
      onClick: handleShare,
      variant: "default",
    },
    {
      icon: Plus,
      label: "Add Current Tab",
      onClick: handleAddTab,
      variant: "default",
    },
    {
      icon: Copy,
      label: "Duplicate Group",
      onClick: handleDuplicate,
      variant: "default",
    },
    {
      icon: Ungroup,
      label: "Ungroup Tabs",
      onClick: handleUngroup,
      variant: "warning",
    },
    {
      icon: Trash2,
      label: "Delete Group",
      onClick: handleDelete,
      variant: "danger",
    },
  ];

  return { actions };
};
