import { useState, useCallback } from "react";

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
  onCreateGroup: (data: { title: string; color: string }) => Promise<void>;
  onUpdateGroup: (
    groupId: number,
    data: { title: string; color: string }
  ) => Promise<void>;
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
