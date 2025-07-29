import TabGroup from "./TabGroup";

interface TabGroupListProps {
  tabGroups: chrome.tabGroups.TabGroup[];
}

const TabGroupList = ({ tabGroups }: TabGroupListProps) => (
  <div className="space-y-2">
    {tabGroups.map((group) => (
      <TabGroup key={group.id} group={group} />
    ))}
  </div>
);

export default TabGroupList;
