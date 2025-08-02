import { useState, useCallback } from "react";
import type { GroupData } from "../services/types";

export interface UseGroupEditorReturn {
  isOpen: boolean;
  editingGroup: chrome.tabGroups.TabGroup | null;
  mode: "create" | "edit";
  initialData: GroupData | undefined;
  openEditor: (group?: chrome.tabGroups.TabGroup) => void;
  closeEditor: () => void;
  saveGroup: (data: GroupData) => Promise<void>;
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
    async (groupData: GroupData) => {
      try {
        if (editingGroup) {
          // Update existing group - delegate to useTabGroups
          await onUpdateGroup(editingGroup.id, groupData);
        } else {
          // Create new group - delegate to useTabGroups
          await onCreateGroup(groupData);
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

  const initialData: GroupData | undefined = editingGroup
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
