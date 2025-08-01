import { useState, useCallback } from "react";
import type { GroupData, ChromeTabGroupColor } from "../services/types";

export interface UseGroupEditorReturn {
  isOpen: boolean;
  editingGroup: chrome.tabGroups.TabGroup | null;
  mode: "create" | "edit";
  initialData: { title: string; color: string } | undefined;
  openEditor: (group?: chrome.tabGroups.TabGroup) => void;
  closeEditor: () => void;
  saveGroup: (data: { title: string; color: string }) => Promise<void>;
}

interface UseGroupEditorProps {
  onCreateGroup: (data: GroupData) => Promise<void>;
  onUpdateGroup: (groupId: number, data: GroupData) => Promise<void>;
}

export const useGroupEditor = ({
  onCreateGroup,
  onUpdateGroup,
}: UseGroupEditorProps): UseGroupEditorReturn => {
  const [isGroupEditorOpen, setIsGroupEditorOpen] = useState(false);
  const [editingGroup, setEditingGroup] =
    useState<chrome.tabGroups.TabGroup | null>(null);

  const openEditor = useCallback((group?: chrome.tabGroups.TabGroup) => {
    setEditingGroup(group || null);
    setIsGroupEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setIsGroupEditorOpen(false);
    setEditingGroup(null);
  }, []);

  const saveGroup = useCallback(
    async (groupData: { title: string; color: string }) => {
      try {
        const typedGroupData: GroupData = {
          title: groupData.title,
          color: groupData.color as ChromeTabGroupColor,
        };

        if (editingGroup) {
          // Update existing group - delegate to useTabGroups
          await onUpdateGroup(editingGroup.id, typedGroupData);
        } else {
          // Create new group - delegate to useTabGroups
          await onCreateGroup(typedGroupData);
        }
      } catch (error) {
        console.error("Error saving group:", error);
        throw error; // Re-throw so calling component can handle it
      } finally {
        closeEditor();
      }
    },
    [editingGroup, onUpdateGroup, onCreateGroup, closeEditor]
  );

  const mode: "create" | "edit" = editingGroup ? "edit" : "create";

  const initialData = editingGroup
    ? { title: editingGroup.title || "", color: editingGroup.color }
    : undefined;

  return {
    isOpen: isGroupEditorOpen,
    editingGroup,
    mode,
    initialData,
    openEditor,
    closeEditor: closeEditor,
    saveGroup,
  };
};
