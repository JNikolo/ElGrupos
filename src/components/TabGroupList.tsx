import TabGroup from "./TabGroup";

interface TabGroupListProps {
  tabGroups: chrome.tabGroups.TabGroup[];
  onEditGroup?: (group: chrome.tabGroups.TabGroup) => void;
}

const TabGroupList = ({ tabGroups, onEditGroup }: TabGroupListProps) => (
  <div className="space-y-2">
    {tabGroups.map((group) => (
      <TabGroup key={group.id} group={group} onEdit={onEditGroup} />
    ))}
  </div>
);

export default TabGroupList;
