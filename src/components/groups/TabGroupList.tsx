import TabGroup from "./TabGroup";

interface TabGroupListProps {
  tabGroups: chrome.tabGroups.TabGroup[];
  onEditGroup?: (group: chrome.tabGroups.TabGroup) => void;
  onDeleteGroup?: (groupId: number) => Promise<void>;
  onUngroupTabs?: (groupId: number) => Promise<void>;
  onAddTab?: (groupId: number) => Promise<void>;
  onDuplicate?: (groupId: number) => Promise<void>;
  onShareGroup?: (group: chrome.tabGroups.TabGroup) => void;
}

const TabGroupList = ({
  tabGroups,
  onEditGroup,
  onDeleteGroup,
  onUngroupTabs,
  onAddTab,
  onDuplicate,
  onShareGroup,
}: TabGroupListProps) => (
  <div className="space-y-2">
    {tabGroups.map((group) => (
      <TabGroup
        key={group.id}
        group={group}
        onEdit={onEditGroup}
        onDelete={onDeleteGroup}
        onUngroup={onUngroupTabs}
        onAddTab={onAddTab}
        onDuplicate={onDuplicate}
        onShare={onShareGroup}
      />
    ))}
  </div>
);

export default TabGroupList;
