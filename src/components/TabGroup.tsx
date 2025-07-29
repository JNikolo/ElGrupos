import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import TabList from "./TabList";
import { getGroupColor } from "../utils/colorUtils";

interface TabGroupProps {
  group: chrome.tabGroups.TabGroup;
}

const TabGroup = ({ group }: TabGroupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);

  const toggleGroupTabs = async () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      try {
        const groupTabs = await chrome.tabs.query({ groupId: group.id });
        setTabs(groupTabs);
        setIsOpen(true);
      } catch (error) {
        console.error("Error loading tabs:", error);
      }
    }
  };

  return (
    <div
      className={`p-3 rounded-xl border-2 transition-all duration-200 ${
        isOpen
          ? "border-purple-400 bg-purple-500/20 shadow-lg"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${getGroupColor(group.color)}`} />
        <span className="font-medium text-white text-sm flex-1 truncate">
          {group.title || "Untitled Group"}
        </span>
        <button
          onClick={toggleGroupTabs}
          className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
            isOpen
              ? "bg-purple-500 text-white"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      <div
        className={`transition-all duration-300 overflow-hidden ${
          isOpen ? "max-h-96 mt-3" : "max-h-0"
        }`}
      >
        {isOpen && <TabList tabs={tabs} groupId={group.id} />}
      </div>
    </div>
  );
};

export default TabGroup;
