import TabGroupList from "./TabGroupList";
import NoGroupsMessage from "./NoGroupsMessage";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorMessage from "../ui/ErrorMessage";

interface GroupsContentProps {
  tabGroups: chrome.tabGroups.TabGroup[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  onEditGroup: (group: chrome.tabGroups.TabGroup) => void;
  onDeleteGroup: (groupId: number) => Promise<void>;
  onUngroupTabs: (groupId: number) => Promise<void>;
  onAddTab: (groupId: number) => Promise<void>;
  onDuplicateGroup: (groupId: number) => Promise<void>;
  onShareGroup: (group: chrome.tabGroups.TabGroup) => void;
}

const GroupsContent = ({
  tabGroups,
  loading,
  error,
  onRetry,
  onEditGroup,
  onDeleteGroup,
  onUngroupTabs,
  onAddTab,
  onDuplicateGroup,
  onShareGroup,
}: GroupsContentProps) => {
  if (loading) {
    return <LoadingSpinner message="Loading tab groups..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (tabGroups.length === 0) {
    return <NoGroupsMessage />;
  }

  return (
    <TabGroupList
      tabGroups={tabGroups}
      onEditGroup={onEditGroup}
      onDeleteGroup={onDeleteGroup}
      onUngroupTabs={onUngroupTabs}
      onAddTab={onAddTab}
      onDuplicate={onDuplicateGroup}
      onShareGroup={onShareGroup}
    />
  );
};

export default GroupsContent;
