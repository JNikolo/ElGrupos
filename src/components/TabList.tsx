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
      <div className="text-center py-4 bg-white/5 rounded-xl border border-white/10 mt-2">
        <ExternalLink className="w-8 h-8 mx-auto text-gray-400 opacity-50 mb-2" />
        <p className="text-gray-400 text-sm">No tabs in this group</p>
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
