import TabGroup from "./TabGroup";

interface TabGroupListProps {
  tabGroups: chrome.tabGroups.TabGroup[];
  isReordering?: boolean;
}

const TabGroupList = ({
  tabGroups,
  isReordering = false,
}: TabGroupListProps) => (
  <div className={`space-y-2 ${isReordering ? "opacity-70" : ""}`}>
    {tabGroups.map((group) => (
      <TabGroup key={group.id} group={group} isReordering={isReordering} />
    ))}
  </div>
);

export default TabGroupList;
