import { useState, useEffect, useCallback } from "react";
import { tabGroupsService } from "../services/tabGroupsService";
import { TabGroupsError } from "../services/errors";
import type { GroupData } from "../services/types";

export interface UseTabGroupsReturn {
  tabGroups: chrome.tabGroups.TabGroup[];
  loading: boolean;
  error: string | null;
  loadTabGroups: () => Promise<void>;
  handleCreateGroup: (data: GroupData) => Promise<void>;
  handleUpdateGroup: (groupId: number, data: GroupData) => Promise<void>;
  handleDeleteGroup: (groupId: number) => Promise<void>;
  handleUngroupTabs: (groupId: number) => Promise<void>;
  handleAddTab: (groupId: number) => Promise<void>;
  handleDuplicateGroup: (groupId: number) => Promise<void>;
}

export const useTabGroups = (): UseTabGroupsReturn => {
  const [tabGroups, setTabGroups] = useState<chrome.tabGroups.TabGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTabGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const groups = await tabGroupsService.getAllGroups();
      setTabGroups(groups);
    } catch (error) {
      console.error("Error loading tab groups:", error);
      const errorMessage =
        error instanceof TabGroupsError
          ? error.message
          : "Failed to load tab groups";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTabGroups();

    const refresh = () => loadTabGroups();

    // Tabs moving between/within groups changes group order
    chrome.tabs.onMoved.addListener(refresh);
    chrome.tabs.onAttached.addListener(refresh);
    chrome.tabs.onDetached.addListener(refresh);
    chrome.tabs.onRemoved.addListener(refresh);
    chrome.tabs.onCreated.addListener(refresh);

    // Group lifecycle/updates
    chrome.tabGroups.onCreated.addListener(refresh);
    // Some Chrome versions expose onMoved; guard with optional chaining
    chrome.tabGroups.onMoved?.addListener(refresh);
    chrome.tabGroups.onRemoved.addListener(refresh);
    chrome.tabGroups.onUpdated.addListener(refresh);

    return () => {
      chrome.tabs.onMoved.removeListener(refresh);
      chrome.tabs.onAttached.removeListener(refresh);
      chrome.tabs.onDetached.removeListener(refresh);
      chrome.tabs.onRemoved.removeListener(refresh);
      chrome.tabs.onCreated.removeListener(refresh);

      chrome.tabGroups.onCreated.removeListener(refresh);
      chrome.tabGroups.onMoved?.removeListener(refresh);
      chrome.tabGroups.onRemoved.removeListener(refresh);
      chrome.tabGroups.onUpdated.removeListener(refresh);
    };
  }, [loadTabGroups]);

  // Helper function for consistent error handling
  const handleError = useCallback(
    (error: unknown, operation: string, fallbackMessage: string) => {
      console.error(`Error ${operation}:`, error);
      const errorMessage =
        error instanceof TabGroupsError
          ? error.message
          : error instanceof Error
          ? error.message
          : fallbackMessage;
      setError(errorMessage);
    },
    []
  );

  const handleCreateGroup = useCallback(
    async (data: GroupData) => {
      try {
        await tabGroupsService.createGroup(data);
        console.log("Created new group:", data);
        await loadTabGroups();
      } catch (error) {
        handleError(error, "creating group", "Failed to create group");
        throw error;
      }
    },
    [loadTabGroups, handleError]
  );

  const handleUpdateGroup = useCallback(
    async (groupId: number, data: GroupData) => {
      try {
        await tabGroupsService.updateGroup(groupId, data);
        console.log("Updated group:", groupId, data);
        await loadTabGroups();
      } catch (error) {
        handleError(error, "updating group", "Failed to update group");
        throw error;
      }
    },
    [loadTabGroups, handleError]
  );

  const handleDeleteGroup = useCallback(
    async (groupId: number) => {
      try {
        await tabGroupsService.deleteGroup(groupId);
        console.log("Deleted group:", groupId);
        await loadTabGroups();
      } catch (error) {
        handleError(error, "deleting group", "Failed to delete group");
      }
    },
    [loadTabGroups, handleError]
  );

  const handleUngroupTabs = useCallback(
    async (groupId: number) => {
      try {
        await tabGroupsService.ungroupTabs(groupId);
        console.log("Ungrouped tabs from group:", groupId);
        await loadTabGroups();
      } catch (error) {
        handleError(error, "ungrouping tabs", "Failed to ungroup tabs");
      }
    },
    [loadTabGroups, handleError]
  );

  const handleAddTab = useCallback(
    async (groupId: number) => {
      try {
        await tabGroupsService.addActiveTabToGroup(groupId);
        console.log("Added tab to group:", groupId);
        await loadTabGroups();
      } catch (error) {
        handleError(error, "adding tab to group", "Failed to add tab to group");
      }
    },
    [loadTabGroups, handleError]
  );

  const handleDuplicateGroup = useCallback(
    async (groupId: number) => {
      try {
        const newGroupId = await tabGroupsService.duplicateGroup(groupId);
        console.log("Duplicated group:", groupId, "to", newGroupId);
        await loadTabGroups();
      } catch (error) {
        handleError(error, "duplicating group", "Failed to duplicate group");
      }
    },
    [loadTabGroups, handleError]
  );

  return {
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
  };
};
