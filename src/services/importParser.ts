import type { ImportedGroup, ImportedTab, ChromeTabGroupColor } from "./types";

export class ImportParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ImportParseError";
  }
}

export class ImportParser {
  static parseData(data: string): ImportedGroup[] {
    const trimmed = data.trim();

    // Try to parse as JSON first
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      return this.parseJSON(trimmed);
    }

    // Otherwise try to parse as Markdown
    return this.parseMarkdown(trimmed);
  }

  private static parseJSON(data: string): ImportedGroup[] {
    try {
      const parsed = JSON.parse(data);

      // Handle single group object with 'title' property
      if (parsed.title && parsed.tabs) {
        return [this.validateGroup(parsed)];
      }

      // Handle single group object with 'groupTitle' property (alternative format)
      if (parsed.groupTitle && parsed.tabs) {
        return [this.validateGroup({ ...parsed, title: parsed.groupTitle })];
      }

      // Handle array of groups
      if (Array.isArray(parsed)) {
        return parsed.map((group) => this.validateGroup(group));
      }

      // Handle wrapper object with groups array
      if (parsed.groups && Array.isArray(parsed.groups)) {
        return parsed.groups.map((group: unknown) => this.validateGroup(group));
      }

      throw new ImportParseError(
        "Invalid JSON structure. Expected group object or array of groups."
      );
    } catch (error) {
      if (error instanceof ImportParseError) {
        throw error;
      }
      throw new ImportParseError("Invalid JSON format");
    }
  }

  private static parseMarkdown(data: string): ImportedGroup[] {
    const lines = data
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    const groups: ImportedGroup[] = [];
    let currentGroup: ImportedGroup | null = null;

    for (const line of lines) {
      // Check for group headers (# or ##)
      if (line.startsWith("#")) {
        if (currentGroup) {
          groups.push(currentGroup);
        }

        const title = line.replace(/^#+\s*/, "").trim();
        currentGroup = {
          title: title,
          color: "grey" as ChromeTabGroupColor,
          tabs: [],
        };
        continue;
      }

      // Check for markdown links
      const linkMatch = line.match(/^\s*-?\s*\[([^\]]+)\]\(([^)]+)\)/);
      if (linkMatch && currentGroup) {
        const [, title, url] = linkMatch;
        currentGroup.tabs.push({
          title: title.trim(),
          url: url.trim(),
        });
        continue;
      }

      // Check for plain URLs
      const urlMatch = line.match(/^\s*-?\s*(https?:\/\/[^\s]+)/);
      if (urlMatch && currentGroup) {
        const url = urlMatch[1];
        currentGroup.tabs.push({
          title: this.extractTitleFromUrl(url),
          url: url,
        });
        continue;
      }

      // If we don't have a current group and find a link, create a default group
      if ((linkMatch || urlMatch) && !currentGroup) {
        currentGroup = {
          title: "Imported Group",
          color: "grey" as ChromeTabGroupColor,
          tabs: [],
        };

        if (linkMatch) {
          const [, title, url] = linkMatch;
          currentGroup.tabs.push({ title: title.trim(), url: url.trim() });
        } else if (urlMatch) {
          const url = urlMatch[1];
          currentGroup.tabs.push({
            title: this.extractTitleFromUrl(url),
            url: url,
          });
        }
      }
    }

    // Add the last group
    if (currentGroup) {
      groups.push(currentGroup);
    }

    if (groups.length === 0) {
      throw new ImportParseError("No valid groups or tabs found in the data");
    }

    return groups;
  }

  private static validateGroup(group: unknown): ImportedGroup {
    if (!group || typeof group !== "object") {
      throw new ImportParseError("Invalid group object");
    }

    const groupObj = group as Record<string, unknown>;

    if (!groupObj.title || typeof groupObj.title !== "string") {
      throw new ImportParseError("Group must have a valid title");
    }

    if (!groupObj.tabs || !Array.isArray(groupObj.tabs)) {
      throw new ImportParseError("Group must have a tabs array");
    }

    const validTabs: ImportedTab[] = [];
    for (const tab of groupObj.tabs) {
      const validatedTab = this.validateTab(tab);
      if (validatedTab) {
        validTabs.push(validatedTab);
      }
    }

    if (validTabs.length === 0) {
      throw new ImportParseError("Group must have at least one valid tab");
    }

    const validColors: ChromeTabGroupColor[] = [
      "blue",
      "cyan",
      "green",
      "grey",
      "orange",
      "pink",
      "purple",
      "red",
      "yellow",
    ];

    return {
      title: groupObj.title.trim(),
      color:
        groupObj.color &&
        validColors.includes(groupObj.color as ChromeTabGroupColor)
          ? (groupObj.color as ChromeTabGroupColor)
          : "grey",
      tabs: validTabs,
    };
  }

  private static validateTab(tab: unknown): ImportedTab | null {
    if (!tab || typeof tab !== "object") {
      return null;
    }

    const tabObj = tab as Record<string, unknown>;

    if (!tabObj.url || typeof tabObj.url !== "string") {
      return null;
    }

    // Basic URL validation
    try {
      new URL(tabObj.url);
    } catch {
      return null;
    }

    return {
      title:
        tabObj.title && typeof tabObj.title === "string"
          ? tabObj.title.trim()
          : this.extractTitleFromUrl(tabObj.url),
      url: tabObj.url.trim(),
    };
  }

  private static extractTitleFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace(/^www\./, "");
      return hostname.charAt(0).toUpperCase() + hostname.slice(1);
    } catch {
      return "Untitled Tab";
    }
  }
}
