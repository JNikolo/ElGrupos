import { getColorConfig } from "../../utils/groupColors";
import type { ChromeTabGroupColor } from "../../services/types";

interface GroupPreviewProps {
  title: string;
  color: ChromeTabGroupColor;
}

const GroupPreview = ({ title, color }: GroupPreviewProps) => {
  const colorConfig = getColorConfig(color);

  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-material-text-secondary mb-2 block">
        Preview
      </label>
      <div className="p-3 bg-material-elevated border border-material-border rounded-material-medium">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${colorConfig.class}`} />
          <span className="text-material-text-primary text-sm font-medium">
            {title || "Untitled Group"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GroupPreview;
