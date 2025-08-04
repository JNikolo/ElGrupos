import { Folder } from "lucide-react";
import ActionButtons from "./ActionButtons";

interface GroupsHeaderProps {
  groupCount: number;
  loading: boolean;
  onRefresh: () => void;
  onCreateGroup: () => void;
  onImportGroups: () => void;
}

const GroupsHeader = ({
  groupCount,
  loading,
  onRefresh,
  onCreateGroup,
  onImportGroups,
}: GroupsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-lg font-semibold text-material-text-primary flex items-center gap-2">
        <Folder className="w-4 h-4" />
        Groups
        <span className="bg-material-primary text-material-text-primary text-xs px-2 py-1 rounded-material-pill">
          {groupCount}
        </span>
      </h2>

      <ActionButtons
        loading={loading}
        onRefresh={onRefresh}
        onCreateGroup={onCreateGroup}
        onImportGroups={onImportGroups}
      />
    </div>
  );
};

export default GroupsHeader;
