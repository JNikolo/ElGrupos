import TabGroup from "./TabGroup";

interface TabGroupListProps {
  tabGroups: chrome.tabGroups.TabGroup[];
  onEditGroup?: (group: chrome.tabGroups.TabGroup) => void;
  onDeleteGroup?: (groupId: number) => void;
  onUngroupTabs?: (groupId: number) => void;
}

const TabGroupList = ({ tabGroups, onEditGroup, onDeleteGroup, onUngroupTabs }: TabGroupListProps) => (
  <div className="space-y-2">
    {tabGroups.map((group) => (
      <TabGroup 
        key={group.id} 
        group={group} 
        onEdit={onEditGroup}
        onDelete={onDeleteGroup}
        onUngroup={onUngroupTabs}
      />
    ))}
  </div>
);

export default TabGroupList;
