// services/chromeAPI.ts
import type { ChromeTabGroupColor } from "./types";

export const chromeAPI = {
  async getCurrentWindow(): Promise<chrome.windows.Window> {
    return chrome.windows.getCurrent();
  },

  async getActiveTab(): Promise<chrome.tabs.Tab | undefined> {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    return tab;
  },

  async queryTabGroups(windowId: number): Promise<chrome.tabGroups.TabGroup[]> {
    return chrome.tabGroups.query({ windowId });
  },

  async queryTabs(windowId?: number): Promise<chrome.tabs.Tab[]> {
    return chrome.tabs.query(windowId !== undefined ? { windowId } : {});
  },

  async getTabGroup(groupId: number): Promise<chrome.tabGroups.TabGroup> {
    return chrome.tabGroups.get(groupId);
  },

  async groupTabs(
    tabIds: number[] | [number, ...number[]],
    groupId?: number
  ): Promise<number> {
    // Ensure tabIds is in the correct format
    const tabIdsArray = Array.isArray(tabIds) ? tabIds : [tabIds];
    if (tabIdsArray.length === 0) {
      throw new Error("At least one tab ID is required");
    }

    const groupConfig: chrome.tabs.GroupOptions = {
      tabIds: tabIdsArray as [number, ...number[]],
    };

    if (groupId !== undefined) {
      groupConfig.groupId = groupId;
    }

    return chrome.tabs.group(groupConfig);
  },

  async ungroupTabs(tabIds: number[] | [number, ...number[]]): Promise<void> {
    if (tabIds.length === 1) {
      await chrome.tabs.ungroup(tabIds[0]);
    } else {
      await chrome.tabs.ungroup(tabIds as [number, ...number[]]);
    }
  },

  async updateTabGroup(
    groupId: number,
    data: { title?: string; color?: ChromeTabGroupColor }
  ): Promise<void> {
    await chrome.tabGroups.update(groupId, data);
  },

  async duplicateTab(tabId: number): Promise<chrome.tabs.Tab> {
    const duplicatedTab = await chrome.tabs.duplicate(tabId);
    if (!duplicatedTab) {
      throw new Error(`Failed to duplicate tab ${tabId}`);
    }
    return duplicatedTab;
  },

  async getTabsInGroup(groupId: number): Promise<chrome.tabs.Tab[]> {
    return chrome.tabs.query({ groupId });
  },

  async deleteTabs(tabIds: number[]): Promise<void> {
    await chrome.tabs.remove(tabIds);
  },

  async createTab(url: string, active?: boolean): Promise<chrome.tabs.Tab> {
    const tab = await chrome.tabs.create({ url, active: active ?? false });
    if (!tab) {
      throw new Error(`Failed to create tab with URL: ${url}`);
    }
    return tab;
  },
};
