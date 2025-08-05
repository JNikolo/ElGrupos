import { RefreshCw, Plus, Import } from "lucide-react";
import Tooltip from "../ui/Tooltip";

interface ActionButtonsProps {
  loading: boolean;
  onRefresh: () => void;
  onCreateGroup: () => void;
  onImportGroups: () => void;
}

const ActionButtons = ({
  loading,
  onRefresh,
  onCreateGroup,
  onImportGroups,
}: ActionButtonsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Tooltip content="Import tab groups">
        <button
          onClick={onImportGroups}
          className="px-2 py-1 bg-material-secondary hover:bg-material-secondary-dark text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-standard)] text-sm font-medium flex items-center gap-1 shadow-material-1"
        >
          <Import className="w-3 h-3" />
          Import
        </button>
      </Tooltip>

      <Tooltip content="Create new group">
        <button
          onClick={onCreateGroup}
          className="px-2 py-1 bg-material-secondary hover:bg-material-secondary-dark text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-standard)] text-sm font-medium flex items-center gap-1 shadow-material-1"
        >
          <Plus className="w-3 h-3" />
          Create
        </button>
      </Tooltip>

      <Tooltip content="Refresh tab groups">
        <button
          onClick={onRefresh}
          disabled={loading}
          className={`px-2 py-1 text-material-primary hover:text-material-primary-dark text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-standard)] text-sm font-medium flex items-center gap-1 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </Tooltip>
    </div>
  );
};

export default ActionButtons;
