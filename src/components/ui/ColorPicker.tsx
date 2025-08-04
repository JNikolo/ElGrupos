import { Palette } from "lucide-react";
import { TAB_GROUP_COLORS } from "../..//utils/groupColors";
import type { ChromeTabGroupColor } from "../../services/types";

interface ColorPickerProps {
  selectedColor: ChromeTabGroupColor;
  onColorChange: (color: ChromeTabGroupColor) => void;
}

const ColorPicker = ({ selectedColor, onColorChange }: ColorPickerProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Palette className="w-4 h-4 text-material-text-secondary" />
        <label className="text-sm font-medium text-material-text-primary">
          Group Color
        </label>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {TAB_GROUP_COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => onColorChange(color.name)}
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
  );
};

export default ColorPicker;
