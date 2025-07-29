import { useState } from "react";
import { Save, X, Edit3, Palette } from "lucide-react";

interface GroupEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: GroupData) => void;
  initialData?: GroupData;
  mode: "create" | "edit";
}

interface GroupData {
  title: string;
  color: string;
}

const GroupEditor = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: GroupEditorProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [selectedColor, setSelectedColor] = useState(
    initialData?.color || "grey"
  );

  const colors = [
    { name: "grey", class: "bg-gray-500", label: "Grey" },
    { name: "blue", class: "bg-blue-500", label: "Blue" },
    { name: "red", class: "bg-red-500", label: "Red" },
    { name: "yellow", class: "bg-yellow-500", label: "Yellow" },
    { name: "green", class: "bg-green-500", label: "Green" },
    { name: "pink", class: "bg-pink-500", label: "Pink" },
    { name: "purple", class: "bg-purple-500", label: "Purple" },
    { name: "cyan", class: "bg-cyan-500", label: "Cyan" },
    { name: "orange", class: "bg-orange-500", label: "Orange" },
  ];

  const handleSave = () => {
    if (title.trim()) {
      onSave({ title: title.trim(), color: selectedColor });
      handleClose();
    }
  };

  const handleClose = () => {
    setTitle(initialData?.title || "");
    setSelectedColor(initialData?.color || "grey");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSave();
    } else if (e.key === "Escape") {
      handleClose();
    }
  };

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
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-material-text-secondary" />
              <label className="text-sm font-medium text-material-text-primary">
                Group Color
              </label>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`relative w-8 h-8 rounded-material-medium transition-all duration-[var(--animate-material-fast)] hover:scale-110 ${
                    color.class
                  } ${
                    selectedColor === color.name
                      ? "ring-2 ring-material-primary ring-offset-2 ring-offset-material-surface shadow-material-2"
                      : "hover:shadow-material-1"
                  }`}
                  title={color.label}
                >
                  {selectedColor === color.name && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full shadow-material-1"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="text-sm font-medium text-material-text-secondary mb-2 block">
              Preview
            </label>
            <div className="p-3 bg-material-elevated border border-material-border rounded-material-medium">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    colors.find((c) => c.name === selectedColor)?.class
                  }`}
                />
                <span className="text-material-text-primary text-sm font-medium">
                  {title || "Untitled Group"}
                </span>
              </div>
            </div>
          </div>

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
              disabled={!title.trim()}
              className={`px-4 py-2 rounded-material-medium transition-colors duration-[var(--animate-material-fast)] font-medium shadow-material-1 flex items-center gap-2 ${
                title.trim()
                  ? "bg-material-primary hover:bg-material-primary-dark text-material-text-primary"
                  : "bg-material-border text-material-text-disabled cursor-not-allowed"
              }`}
            >
              <Save className="w-4 h-4" />
              {mode === "create" ? "Create Group" : "Save Changes"}
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
