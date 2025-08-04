import { ExternalLink, Share2 } from "lucide-react";
import TabItem from "./TabItem";
// import CopyButton from "./CopyButton";
import Tooltip from "../ui/Tooltip";
import { useState } from "react";
import ShareGroup from "../share/ShareGroup";

interface TabListProps {
  tabs: chrome.tabs.Tab[];
  groupId: number;
}

const TabList = ({ tabs, groupId }: TabListProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => {
    setIsOpen(false);
  };

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

  // const allLinks = tabs
  //   .filter((tab) => tab.url)
  //   .map((tab) => `- [${tab.title || "Untitled"}](${tab.url})`)
  //   .join("\n");

  return (
    <>
      <div className="flex justify-end items-center gap-2 mb-2">
        <Tooltip content="Share all links in one URL">
          <button
            onClick={() => {
              setIsOpen(true);
            }}
            className="px-2 py-1 bg-material-info hover:bg-blue-600 text-material-text-primary rounded-material-small transition-colors duration-[var(--animate-material-fast)] text-xs font-medium flex items-center gap-1 shadow-material-1"
          >
            <Share2 className="w-3 h-3" />
            Share
          </button>
        </Tooltip>
        {/* <CopyButton textToCopy={allLinks} id={`group-${groupId}`} /> */}
      </div>
      <div className="space-y-2 max-h-60 overflow-y-auto pr-2 scrollbar-custom">
        {tabs.map((tab) => (
          <TabItem key={tab.id} tab={tab} />
        ))}
      </div>
      {isOpen && <ShareGroup groupId={groupId} handleClose={onClose} />}
    </>
  );
};

export default TabList;
