import { useState, useEffect, useCallback } from "react";

export interface UseTabGroupsReturn {
  tabGroups: chrome.tabGroups.TabGroup[];
  loading: boolean;
  error: string | null;
  loadTabGroups: () => Promise<void>;
  handleCreateGroup: (data: { title: string; color: string }) => Promise<void>;
  handleUpdateGroup: (
    groupId: number,
    data: { title: string; color: string }
  ) => Promise<void>;
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
      // Use the current window so the order matches what the user sees
      const currentWindow = await chrome.windows.getCurrent();

      // Get all groups and all tabs for this window in parallel
      const [groups, tabs] = await Promise.all([
        chrome.tabGroups.query({ windowId: currentWindow.id }),
        chrome.tabs.query({ windowId: currentWindow.id }),
      ]);

      // Build a map: groupId -> leftmost tab index
      const leftmostIndexByGroup = new Map<number, number>();
      for (const tab of tabs) {
        if (
          tab.groupId !== undefined &&
          tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE &&
          typeof tab.index === "number"
        ) {
          const existing = leftmostIndexByGroup.get(tab.groupId);
          if (existing === undefined || tab.index < existing) {
            leftmostIndexByGroup.set(tab.groupId, tab.index);
          }
        }
      }

      // Sort groups by the leftmost tab index
      const sorted = [...groups].sort((a, b) => {
        const ai = leftmostIndexByGroup.get(a.id) ?? Number.MAX_SAFE_INTEGER;
        const bi = leftmostIndexByGroup.get(b.id) ?? Number.MAX_SAFE_INTEGER;
        return ai - bi;
      });

      setTabGroups(sorted);
    } catch (error) {
      console.error("Error loading tab groups:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load tab groups"
      );
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

  // Helper function to handle ungrouping tabs
  const ungroupTabsById = useCallback(async (tabIds: number[]) => {
    if (tabIds.length === 0) return;

    if (tabIds.length === 1) {
      await chrome.tabs.ungroup(tabIds[0]);
    } else {
      await chrome.tabs.ungroup(tabIds as [number, ...number[]]);
    }
  }, []);

  // Helper function to get valid tab IDs
  const getValidTabIds = useCallback((tabs: chrome.tabs.Tab[]): number[] => {
    return tabs
      .map((tab) => tab.id)
      .filter((id): id is number => id !== undefined);
  }, []);

  // Helper function for consistent error handling
  const handleError = useCallback(
    (error: unknown, operation: string, fallbackMessage: string) => {
      console.error(`Error ${operation}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : fallbackMessage;
      setError(errorMessage);
    },
    []
  );

  const handleCreateGroup = useCallback(
    async (data: { title: string; color: string }) => {
      try {
        // Get the current active tab
        const activeTabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (activeTabs.length === 0 || !activeTabs[0].id) {
          throw new Error("No active tab found to create group");
        }

        // Create group with active tab
        const groupId = await chrome.tabs.group({
          tabIds: [activeTabs[0].id],
        });

        // Update group with title and color
        await chrome.tabGroups.update(groupId, {
          title: data.title,
          color: data.color as
            | "blue"
            | "cyan"
            | "green"
            | "grey"
            | "orange"
            | "pink"
            | "purple"
            | "red"
            | "yellow",
        });

        console.log("Created new group:", groupId, data);

        // Refresh the groups list
        await loadTabGroups();
      } catch (error) {
        handleError(error, "creating group", "Failed to create group");
        throw error;
      }
    },
    [loadTabGroups, handleError]
  );

  const handleUpdateGroup = useCallback(
    async (groupId: number, data: { title: string; color: string }) => {
      try {
        // Update existing group
        await chrome.tabGroups.update(groupId, {
          title: data.title,
          color: data.color as
            | "blue"
            | "cyan"
            | "green"
            | "grey"
            | "orange"
            | "pink"
            | "purple"
            | "red"
            | "yellow",
        });

        console.log("Updated group:", groupId, data);

        // Refresh the groups list
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
        // Get all tabs in the group first
        const tabs = await chrome.tabs.query({ groupId });
        const tabIds = getValidTabIds(tabs);

        // Remove tabs from the group (ungroup them first)
        await ungroupTabsById(tabIds);

        // Note: Chrome automatically removes empty groups, so no need to explicitly delete
        console.log("Deleted group:", groupId);

        // Refresh the groups list
        await loadTabGroups();
      } catch (error) {
        handleError(error, "deleting group", "Failed to delete group");
      }
    },
    [loadTabGroups, ungroupTabsById, getValidTabIds, handleError]
  );

  const handleUngroupTabs = useCallback(
    async (groupId: number) => {
      try {
        // Get all tabs in the group
        const tabs = await chrome.tabs.query({ groupId });
        const tabIds = getValidTabIds(tabs);

        // Remove all tabs from the group
        await ungroupTabsById(tabIds);

        console.log("Ungrouped tabs from group:", groupId);

        // Refresh the groups list
        await loadTabGroups();
      } catch (error) {
        handleError(error, "ungrouping tabs", "Failed to ungroup tabs");
      }
    },
    [loadTabGroups, ungroupTabsById, getValidTabIds, handleError]
  );

  const handleAddTab = useCallback(
    async (groupId: number) => {
      try {
        // Get the current active tab
        const activeTabs = await chrome.tabs.query({
          active: true,
          currentWindow: true,
        });

        if (activeTabs.length === 0 || activeTabs[0].id === undefined) {
          throw new Error("No active tab found to add to group");
        }

        const activeTab = activeTabs[0];

        // Check if the tab is already in a group
        if (activeTab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
          throw new Error(
            "Active tab is already in a group. Please ungroup it first or select a different tab."
          );
        }

        // Add the active tab to the group
        await chrome.tabs.group({
          tabIds: [activeTab.id!],
          groupId: groupId,
        });

        console.log("Added tab to group:", groupId);

        // Refresh the groups list
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
        // Get the group details
        const group = await chrome.tabGroups.get(groupId);
        if (!group) {
          throw new Error("Group not found");
        }

        // Get all tabs in the original group
        const tabs = await chrome.tabs.query({ groupId });

        if (tabs.length === 0) {
          throw new Error("No tabs found in group to duplicate");
        }

        // Create new tabs by duplicating each tab in the group
        const newTabIds: number[] = [];
        for (const tab of tabs) {
          if (tab.id !== undefined) {
            const duplicatedTab = await chrome.tabs.duplicate(tab.id);
            if (duplicatedTab && duplicatedTab.id !== undefined) {
              newTabIds.push(duplicatedTab.id);
            }
          }
        }

        if (newTabIds.length === 0) {
          throw new Error("Failed to duplicate any tabs");
        }

        // Create a new group with the duplicated tabs
        const newGroupId = await chrome.tabs.group({
          tabIds: newTabIds as [number, ...number[]],
        });

        // Update the new group with the same title and color as the original
        await chrome.tabGroups.update(newGroupId, {
          title: group.title
            ? `${group.title} (Copy)`
            : "Untitled Group (Copy)",
          color: group.color,
        });

        console.log("Duplicated group:", groupId, "to", newGroupId);

        // Refresh the groups list
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
