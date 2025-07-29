import { ExternalLink } from "lucide-react";
import CopyButton from "./CopyButton";

interface TabItemProps {
  tab: chrome.tabs.Tab;
}

const TabItem = ({ tab }: TabItemProps) => (
  <div className="p-2 bg-material-surface border border-material-border rounded-material-medium hover:bg-material-elevated transition-colors duration-[var(--animate-material-fast)] shadow-material-1">
    <div className="flex items-start gap-2">
      <div className="flex-shrink-0 mt-0.5">
        {tab.favIconUrl ? (
          <img
            src={tab.favIconUrl}
            alt=""
            className="w-4 h-4 rounded-material-small"
          />
        ) : (
          <ExternalLink className="w-4 h-4 text-material-text-disabled" />
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="font-medium text-material-text-primary text-xs truncate">
          {tab.title || "Untitled Tab"}
        </h3>
        {tab.url && (
          <p className="text-xs text-material-text-secondary truncate mt-0.5">
            {tab.url}
          </p>
        )}
      </div>
      {tab.url && (
        <CopyButton textToCopy={tab.url} id={`tab-${tab.id}`} isIcon />
      )}
    </div>
  </div>
);

export default TabItem;
