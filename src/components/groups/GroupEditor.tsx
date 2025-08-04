import { Save, X, Edit3 } from "lucide-react";
import { useGroupForm } from "../../hooks/useGroupForm";
import ColorPicker from "../ui/ColorPicker";
import GroupPreview from "./GroupPreview";
import type { GroupData } from "../../services/types";

interface GroupEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: GroupData) => Promise<void>;
  initialData?: GroupData;
  mode: "create" | "edit";
}

const GroupEditor = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: GroupEditorProps) => {
  const {
    title,
    setTitle,
    selectedColor,
    setSelectedColor,
    isSubmitting,
    isValid,
    handleSave,
    handleClose,
    handleKeyDown,
  } = useGroupForm({
    initialData,
    onSave,
    onClose,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-material-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-material-surface border border-material-border rounded-material-large shadow-material-8 w-full max-w-md">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-material-primary" />
              <h3 className="text-lg font-semibold text-material-text-primary">
                {mode === "create" ? "Create New Group" : "Edit Group"}
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-material-text-secondary hover:text-material-text-primary hover:bg-material-elevated rounded-material-small transition-colors duration-[var(--animate-material-fast)]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Group Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-material-text-primary mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter group name..."
              className="w-full px-3 py-2.5 bg-material-elevated border border-material-border rounded-material-medium text-material-text-primary placeholder-material-text-disabled text-sm transition-all duration-[var(--animate-material-fast)] focus:outline-none focus:ring-2 focus:ring-material-primary focus:border-material-primary shadow-material-1"
              autoFocus
            />
          </div>

          {/* Color Selection */}
          <ColorPicker
            selectedColor={selectedColor}
            onColorChange={setSelectedColor}
          />

          {/* Preview */}
          <GroupPreview title={title} color={selectedColor} />

          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-material-border hover:bg-material-elevated text-material-text-primary rounded-material-medium transition-colors duration-[var(--animate-material-fast)] font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isValid || isSubmitting}
              className={`px-4 py-2 rounded-material-medium transition-colors duration-[var(--animate-material-fast)] font-medium shadow-material-1 flex items-center gap-2 ${
                isValid && !isSubmitting
                  ? "bg-material-primary hover:bg-material-primary-dark text-material-text-primary"
                  : "bg-material-border text-material-text-disabled cursor-not-allowed"
              }`}
            >
              <Save className="w-4 h-4" />
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Create Group"
                : "Save Changes"}
            </button>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-4 pt-4 border-t border-material-divider">
            <p className="text-xs text-material-text-disabled">
              Press{" "}
              <kbd className="px-1 py-0.5 bg-material-border rounded text-xs">
                Ctrl+Enter
              </kbd>{" "}
              to save,{" "}
              <kbd className="px-1 py-0.5 bg-material-border rounded text-xs">
                Esc
              </kbd>{" "}
              to cancel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupEditor;
