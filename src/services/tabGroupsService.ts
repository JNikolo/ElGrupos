// services/tabGroupsService.ts
import { chromeAPI } from "./chromeAPI";
import { TabGroupsError } from "./errors";
import type { GroupData, ImportedGroup } from "./types";

class TabGroupsService {
  private api = chromeAPI;

  async getAllGroups(): Promise<chrome.tabGroups.TabGroup[]> {
    try {
      const currentWindow = await this.api.getCurrentWindow();
      if (!currentWindow.id) {
        throw new TabGroupsError("No current window found");
      }
      const [groups, tabs] = await Promise.all([
        this.api.queryTabGroups(currentWindow.id),
        this.api.queryTabs(currentWindow.id),
      ]);
      return this.sortGroupsByPosition(groups, tabs);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to get tab groups";
      throw new TabGroupsError(message);
    }
  }

  async createGroup(data: GroupData): Promise<number> {
    const activeTab = await this.api.getActiveTab();
    if (!activeTab?.id) throw new TabGroupsError("No active tab found");

    const groupId = await this.api.groupTabs([activeTab.id]);
    await this.api.updateTabGroup(groupId, data);
    return groupId;
  }

  async updateGroup(groupId: number, data: GroupData): Promise<void> {
    await this.api.updateTabGroup(groupId, data);
  }

  async deleteGroup(groupId: number): Promise<void> {
    const tabs = await this.api.getTabsInGroup(groupId);
    const tabIds = this.getValidTabIds(tabs);
    await this.api.deleteTabs(tabIds);
  }

  async duplicateGroup(groupId: number): Promise<number> {
    const [group, tabs] = await Promise.all([
      this.api.getTabGroup(groupId),
      this.api.getTabsInGroup(groupId),
    ]);

    if (tabs.length === 0) throw new TabGroupsError("No tabs in group");

    const newTabIds = await Promise.all(
      tabs.map(async (tab: chrome.tabs.Tab) => {
        if (tab.id === undefined) return null;
        const duplicated = await this.api.duplicateTab(tab.id);
        return duplicated.id ?? null;
      })
    );

    const validTabIds = newTabIds.filter(
      (id: number | null): id is number => id !== null
    );
    if (validTabIds.length === 0)
      throw new TabGroupsError("Failed to duplicate tabs");

    const newGroupId = await this.api.groupTabs(
      validTabIds as [number, ...number[]]
    );
    const newTitle = group.title
      ? `${group.title} (Copy)`
      : "Untitled Group (Copy)";
    await this.api.updateTabGroup(newGroupId, {
      title: newTitle,
      color: group.color,
    });

    return newGroupId;
  }

  async addActiveTabToGroup(groupId: number): Promise<void> {
    const activeTab = await this.api.getActiveTab();
    if (!activeTab?.id) throw new TabGroupsError("No active tab");
    if (activeTab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE)
      throw new TabGroupsError("Tab already in group");

    await this.api.groupTabs([activeTab.id], groupId);
  }

  async ungroupTabs(groupId: number): Promise<void> {
    const tabs = await this.api.getTabsInGroup(groupId);
    const tabIds = this.getValidTabIds(tabs);
    await this.api.ungroupTabs(tabIds);
  }

  async createGroupFromImport(importedGroup: ImportedGroup): Promise<number> {
    if (!importedGroup.tabs || importedGroup.tabs.length === 0) {
      throw new TabGroupsError("Group must have at least one tab");
    }

    // Create tabs from the imported data
    const createdTabs: chrome.tabs.Tab[] = [];
    for (const importedTab of importedGroup.tabs) {
      try {
        const tab = await this.api.createTab(importedTab.url, false);
        createdTabs.push(tab);
      } catch (error) {
        console.warn(`Failed to create tab for URL: ${importedTab.url}`, error);
        // Continue with other tabs rather than failing completely
      }
    }

    if (createdTabs.length === 0) {
      throw new TabGroupsError(
        "Failed to create any tabs from the imported data"
      );
    }

    // Group the created tabs
    const tabIds = this.getValidTabIds(createdTabs);
    const groupId = await this.api.groupTabs(tabIds as [number, ...number[]]);

    // Update group properties
    await this.api.updateTabGroup(groupId, {
      title: importedGroup.title || "Imported Group",
      color: importedGroup.color || "grey",
    });

    return groupId;
  }

  // Helpers
  private sortGroupsByPosition(
    groups: chrome.tabGroups.TabGroup[],
    tabs: chrome.tabs.Tab[]
  ): chrome.tabGroups.TabGroup[] {
    const map = new Map<number, number>();
    for (const tab of tabs) {
      if (
        tab.groupId !== undefined &&
        tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE &&
        typeof tab.index === "number"
      ) {
        const current = map.get(tab.groupId);
        if (current === undefined || tab.index < current) {
          map.set(tab.groupId, tab.index);
        }
      }
    }

    return [...groups].sort((a, b) => {
      const ai = map.get(a.id) ?? Number.MAX_SAFE_INTEGER;
      const bi = map.get(b.id) ?? Number.MAX_SAFE_INTEGER;
      return ai - bi;
    });
  }

  private getValidTabIds(tabs: chrome.tabs.Tab[]): number[] {
    return tabs
      .map((tab) => tab.id)
      .filter((id): id is number => id !== undefined);
  }
}

export const tabGroupsService = new TabGroupsService();
