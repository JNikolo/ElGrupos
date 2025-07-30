/**
 * Utility functions for Chrome tab and tab group operations
 */

/** ---------- Small helpers ---------- */

const sortTabsByIndex = (tabs: chrome.tabs.Tab[]) =>
  tabs.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

/**
 * Clamp a number to an inclusive range.
 */
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n));

/**
 * Get all groups in a window, sorted by their visual order.
 * We infer group order by the index of the group's first tab.
 */
const getGroupsInWindowSorted = async (
  windowId: number
): Promise<chrome.tabGroups.TabGroup[]> => {
  const groups = await chrome.tabGroups.query({ windowId });

  if (groups.length === 0) return groups;

  const withPos = await Promise.all(
    groups.map(async (group) => {
      const tabs = await chrome.tabs.query({ groupId: group.id, windowId });
      const firstIndex = tabs.length
        ? Math.min(...tabs.map((t) => t.index ?? 0))
        : Number.POSITIVE_INFINITY;
      return { group, firstIndex };
    })
  );

  withPos.sort((a, b) => a.firstIndex - b.firstIndex);
  return withPos.map((x) => x.group);
};

/** ---------- Tab-level utilities ---------- */

/**
 * Move a tab to a new position within its group (UPDATED SIGNATURE)
 * - Keeps the tab inside the group even when moving to the end.
 * - Fixes the "jump one extra" bug on downward moves.
 */
export const moveTabInGroup = async (
  tabId: number,
  groupId: number,
  newGroupIndex: number
): Promise<void> => {
  try {
    // Get tabs in the target group (sorted)
    let groupTabs = await chrome.tabs.query({ groupId });
    groupTabs = sortTabsByIndex(groupTabs);

    if (groupTabs.length === 0) {
      throw new Error("Group has no tabs.");
    }

    // Find the tab and its current position within the group
    const currentInGroupIdx = groupTabs.findIndex((t) => t.id === tabId);
    if (currentInGroupIdx === -1) {
      throw new Error("Tab is not in the specified group.");
    }

    // Normalize the target index
    const targetInGroupIdx = clamp(newGroupIndex, 0, groupTabs.length - 1);
    if (currentInGroupIdx === targetInGroupIdx) return;

    const tabToMove = groupTabs[currentInGroupIdx];
    if (!tabToMove.id) throw new Error("Tab ID is undefined");

    // Determine the destination absolute index
    const movingDown = currentInGroupIdx < targetInGroupIdx;

    let destinationIndex: number;
    if (movingDown) {
      if (targetInGroupIdx === groupTabs.length - 1) {
        // To the very end: place AFTER the last tab of the group
        destinationIndex = (groupTabs[targetInGroupIdx].index ?? 0) + 1;
      } else {
        // Middle downward move: insert BEFORE the target
        destinationIndex = groupTabs[targetInGroupIdx].index ?? 0;
      }
    } else {
      // Moving up: insert BEFORE the target
      destinationIndex = groupTabs[targetInGroupIdx].index ?? 0;
    }

    // Move the tab
    await chrome.tabs.move(tabToMove.id, { index: destinationIndex });

    // Ensure the tab remains in the group (Chrome may pop it out when dropping after the last tab).
    const moved = await chrome.tabs.get(tabToMove.id);
    if (moved.groupId !== groupId) {
      await chrome.tabs.group({ groupId, tabIds: tabToMove.id });
    }
  } catch (error) {
    console.error("Error moving tab within group:", error);
    throw error;
  }
};

/**
 * Get the current index of a tab within its group (0-based in the group order).
 */
export const getTabIndexInGroup = (
  tabs: chrome.tabs.Tab[],
  tabId: number
): number => {
  return tabs.findIndex((tab) => tab.id === tabId);
};

/**
 * Reorder tabs within a group (refactored)
 * - Uses absolute tab indices directly
 * - Works correctly when moving up or down (no extra jump)
 * - Keeps the tab in the group after the move
 */
export const reorderTabsInGroup = async (
  groupId: number,
  oldIndex: number,
  newIndex: number
): Promise<chrome.tabs.Tab[]> => {
  try {
    // Get all tabs in the group and ensure visual order
    let groupTabs = await chrome.tabs.query({ groupId });
    groupTabs = sortTabsByIndex(groupTabs);

    if (
      groupTabs.length === 0 ||
      oldIndex < 0 ||
      newIndex < 0 ||
      oldIndex >= groupTabs.length ||
      newIndex >= groupTabs.length ||
      oldIndex === newIndex
    ) {
      return groupTabs;
    }

    const tabToMove = groupTabs[oldIndex];
    if (!tabToMove.id) throw new Error("Tab ID is undefined");

    const movingDown = oldIndex < newIndex;

    let destinationIndex: number;
    if (movingDown) {
      if (newIndex === groupTabs.length - 1) {
        // To the very end: place AFTER the last tab of the group
        destinationIndex = (groupTabs[newIndex].index ?? 0) + 1;
      } else {
        // Middle downward move: insert BEFORE the target
        destinationIndex = groupTabs[newIndex].index ?? 0;
      }
    } else {
      // Moving up: insert BEFORE the target
      destinationIndex = groupTabs[newIndex].index ?? 0;
    }

    // Move the tab
    await chrome.tabs.move(tabToMove.id, { index: destinationIndex });

    // Keep it grouped if Chrome popped it out (can happen when dropping "after" the last tab)
    const moved = await chrome.tabs.get(tabToMove.id);
    if (moved.groupId !== groupId) {
      await chrome.tabs.group({ groupId, tabIds: tabToMove.id });
    }

    // Return fresh, updated list for the group
    let updated = await chrome.tabs.query({ groupId });
    updated = sortTabsByIndex(updated);
    return updated;
  } catch (error) {
    console.error("Error reordering tabs:", error);
    throw error;
  }
};

/** ---------- Group-level utilities ---------- */

/**
 * Reorder tab groups using the Chrome Tab Groups API
 * - Uses group order indices (not tab indices)
 * - No -1 (not valid for tabGroups.move)
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

    // Identify the group to move and its window
    const groupToMove = groups[oldIndex];
    const windowId = groupToMove.windowId;
    if (windowId === undefined) throw new Error("Group has no windowId.");

    // Get the authoritative, *sorted* list of groups for that window
    const currentGroups = await getGroupsInWindowSorted(windowId);

    // Map the moving group to its current position in the sorted list
    const currentPos = currentGroups.findIndex((g) => g.id === groupToMove.id);
    if (currentPos === -1) {
      throw new Error(
        "Could not locate the group to move in the current window."
      );
    }

    // Clamp desired position to a valid range (defensive)
    const desiredPos = clamp(newIndex, 0, currentGroups.length - 1);

    if (currentPos === desiredPos) {
      return currentGroups;
    }

    // Move the group to the desired group-index (final position among groups)
    await chrome.tabGroups.move(groupToMove.id, { index: desiredPos });

    // Return the updated, correctly sorted groups
    return await getGroupsInWindowSorted(windowId);
  } catch (error) {
    console.error("Error reordering tab groups:", error);
    throw error;
  }
};

/**
 * Get tab groups sorted by their actual position in the browser.
 * - Aggregates per-window results from getGroupsInWindowSorted
 */
export const getSortedTabGroups = async (): Promise<
  chrome.tabGroups.TabGroup[]
> => {
  try {
    const allGroups = await chrome.tabGroups.query({});
    if (allGroups.length === 0) return allGroups;

    // Bucket groups by windowId
    const byWindow = new Map<number, chrome.tabGroups.TabGroup[]>();
    for (const g of allGroups) {
      if (g.windowId === undefined) continue;
      if (!byWindow.has(g.windowId)) byWindow.set(g.windowId, []);
      byWindow.get(g.windowId)!.push(g);
    }

    // For each window, sort by first tab's index; then flatten in window order
    const windows = Array.from(byWindow.keys()).sort((a, b) => a - b);
    const result: chrome.tabGroups.TabGroup[] = [];
    for (const winId of windows) {
      const sorted = await getGroupsInWindowSorted(winId);
      result.push(...sorted);
    }
    return result;
  } catch (error) {
    console.error("Error getting sorted tab groups:", error);
    throw error;
  }
};
