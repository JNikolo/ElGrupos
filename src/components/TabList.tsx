import { ExternalLink } from "lucide-react";
import TabItem from "./TabItem";
import CopyButton from "./CopyButton";

interface TabListProps {
  tabs: chrome.tabs.Tab[];
  groupId: number;
}

const TabList = ({ tabs, groupId }: TabListProps) => {
  if (!tabs.length) {
    return (
      <div className="text-center py-4 bg-material-surface rounded-material-medium border border-material-border mt-2 shadow-material-1">
        <ExternalLink className="w-8 h-8 mx-auto text-material-text-disabled mb-2" />
        <p className="text-material-text-secondary text-sm">
          No tabs in this group
        </p>
      </div>
    );
  }

  const allLinks = tabs
    .filter((tab) => tab.url)
    .map((tab) => `- [${tab.title || "Untitled"}](${tab.url})`)
    .join("\n");

  return (
    <>
      <div className="flex justify-end mb-2">
        <CopyButton textToCopy={allLinks} id={`group-${groupId}`} />
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-custom">
        {tabs.map((tab) => (
          <TabItem key={tab.id} tab={tab} />
        ))}
      </div>
    </>
  );
};

export default TabList;
