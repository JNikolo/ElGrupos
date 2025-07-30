/**
 * Utility functions for Chrome tab operations
 */

/**
 * Move a tab to a new position within its group
 */
export const moveTabInGroup = async (
  tabId: number,
  newIndex: number
): Promise<void> => {
  try {
    await chrome.tabs.move(tabId, { index: newIndex });
  } catch (error) {
    console.error("Error moving tab:", error);
    throw error;
  }
};

/**
 * Get the current index of a tab within its group
 */
export const getTabIndexInGroup = (
  tabs: chrome.tabs.Tab[],
  tabId: number
): number => {
  return tabs.findIndex((tab) => tab.id === tabId);
};

/**
 * Reorder tabs within a group
 */
export const reorderTabsInGroup = async (
  groupId: number,
  oldIndex: number,
  newIndex: number
): Promise<chrome.tabs.Tab[]> => {
  try {
    // Get all tabs in the group
    const groupTabs = await chrome.tabs.query({ groupId });

    if (
      oldIndex < 0 ||
      oldIndex >= groupTabs.length ||
      newIndex < 0 ||
      newIndex >= groupTabs.length
    ) {
      throw new Error("Invalid tab indices");
    }

    const tabToMove = groupTabs[oldIndex];
    if (!tabToMove.id) {
      throw new Error("Tab ID is undefined");
    }

    // Calculate the new absolute index
    // We need to find the absolute position considering all tabs in the window
    const allTabs = await chrome.tabs.query({ windowId: tabToMove.windowId });
    const groupStartIndex = allTabs.findIndex(
      (tab) => tab.id === groupTabs[0].id
    );

    if (groupStartIndex === -1) {
      throw new Error("Could not find group start position");
    }

    const newAbsoluteIndex = groupStartIndex + newIndex;

    // Move the tab
    await chrome.tabs.move(tabToMove.id, { index: newAbsoluteIndex });

    // Return updated tab list
    return await chrome.tabs.query({ groupId });
  } catch (error) {
    console.error("Error reordering tabs:", error);
    throw error;
  }
};

/**
 * Reorder tab groups by moving all tabs in the groups
 */
export const reorderTabGroups = async (
  groups: chrome.tabGroups.TabGroup[],
  oldIndex: number,
  newIndex: number
): Promise<chrome.tabGroups.TabGroup[]> => {
  try {
    if (
      oldIndex < 0 ||
      oldIndex >= groups.length ||
      newIndex < 0 ||
      newIndex >= groups.length ||
      oldIndex === newIndex
    ) {
      return groups;
    }

    const groupToMove = groups[oldIndex];

    // Get all tabs for the group being moved
    const groupTabs = await chrome.tabs.query({ groupId: groupToMove.id });

    if (groupTabs.length === 0) {
      throw new Error("No tabs found in the group to move");
    }

    // Determine the target position
    let targetIndex: number;

    if (newIndex === 0) {
      // Moving to the beginning
      targetIndex = 0;
    } else if (newIndex >= groups.length - 1) {
      // Moving to the end - get all tabs and move to the end
      const allTabs = await chrome.tabs.query({
        windowId: groupTabs[0].windowId,
      });
      targetIndex = allTabs.length;
    } else {
      // Moving to a position between other groups
      const targetGroup = groups[newIndex];
      const targetGroupTabs = await chrome.tabs.query({
        groupId: targetGroup.id,
      });

      if (targetGroupTabs.length === 0) {
        throw new Error("Target group has no tabs");
      }

      // Get all tabs in the window to find the absolute position
      const allTabs = await chrome.tabs.query({
        windowId: groupTabs[0].windowId,
      });

      if (oldIndex < newIndex) {
        // Moving forward - place after the target group
        const targetGroupEndIndex = allTabs.findIndex(
          (tab) => tab.id === targetGroupTabs[targetGroupTabs.length - 1].id
        );
        targetIndex = targetGroupEndIndex + 1;
      } else {
        // Moving backward - place before the target group
        const targetGroupStartIndex = allTabs.findIndex(
          (tab) => tab.id === targetGroupTabs[0].id
        );
        targetIndex = targetGroupStartIndex;
      }
    }

    // Move all tabs in the group to the new position
    const tabIds = groupTabs
      .map((tab) => tab.id)
      .filter((id): id is number => id !== undefined);

    if (tabIds.length > 0) {
      await chrome.tabs.move(tabIds, { index: targetIndex });
    }

    // Return updated groups list sorted by their actual position
    return await getSortedTabGroups();
  } catch (error) {
    console.error("Error reordering tab groups:", error);
    throw error;
  }
};

/**
 * Get tab groups sorted by their actual position in the browser
 */
export const getSortedTabGroups = async (): Promise<
  chrome.tabGroups.TabGroup[]
> => {
  try {
    const groups = await chrome.tabGroups.query({});

    if (groups.length === 0) {
      return groups;
    }

    // Get all tabs for each group to determine their positions
    const groupsWithPosition = await Promise.all(
      groups.map(async (group) => {
        const groupTabs = await chrome.tabs.query({ groupId: group.id });
        // Use the index of the first tab in the group as the group's position
        const firstTabIndex =
          groupTabs.length > 0 ? groupTabs[0].index : Infinity;
        return { group, position: firstTabIndex };
      })
    );

    // Sort groups by the position of their first tab
    groupsWithPosition.sort((a, b) => a.position - b.position);

    return groupsWithPosition.map((item) => item.group);
  } catch (error) {
    console.error("Error getting sorted tab groups:", error);
    throw error;
  }
};
