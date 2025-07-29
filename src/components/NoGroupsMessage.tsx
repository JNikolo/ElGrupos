import { Folder } from "lucide-react";

const NoGroupsMessage = () => (
  <div className="text-center py-6 bg-material-surface rounded-material-medium border border-material-border shadow-material-1">
    <Folder className="w-12 h-12 mx-auto text-material-text-disabled mb-2" />
    <p className="text-material-text-secondary text-sm mb-1">
      No tab groups found
    </p>
    <p className="text-material-text-disabled text-xs">
      Create tab groups in Chrome first
    </p>
  </div>
);

export default NoGroupsMessage;
