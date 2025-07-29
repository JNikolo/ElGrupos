import { ExternalLink } from "lucide-react";
import CopyButton from "./CopyButton";

interface TabItemProps {
  tab: chrome.tabs.Tab;
}

const TabItem = ({ tab }: TabItemProps) => (
  <div className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 mt-0.5">
        {tab.favIconUrl ? (
          <img src={tab.favIconUrl} alt="" className="w-4 h-4 rounded" />
        ) : (
          <ExternalLink className="w-4 h-4 text-gray-400" />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-white text-xs truncate">
          {tab.title || "Untitled Tab"}
        </h3>
        {tab.url && (
          <p className="text-xs text-gray-400 truncate mt-0.5">{tab.url}</p>
        )}
      </div>
      {tab.url && (
        <CopyButton textToCopy={tab.url} id={`tab-${tab.id}`} isIcon />
      )}
    </div>
  </div>
);

export default TabItem;
