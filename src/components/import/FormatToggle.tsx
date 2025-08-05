import { BookOpenText, FileJson } from "lucide-react";
import type { ImportFormat } from "../../hooks/useImportLogic";

interface FormatToggleProps {
  importFormat: ImportFormat;
  onFormatChange: (format: ImportFormat) => void;
}

const FormatToggle = ({ importFormat, onFormatChange }: FormatToggleProps) => {
  const options = [
    {
      label: "Text",
      icon: <BookOpenText className="w-3 h-3" />,
      value: "text" as const,
    },
    {
      label: "File",
      icon: <FileJson className="w-3 h-3" />,
      value: "file" as const,
    },
  ];

  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="text-sm font-medium text-material-text-secondary">
        Import as:
      </span>
      <div className="flex bg-material-elevated rounded-material-medium p-1">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onFormatChange(option.value)}
            className={`px-3 py-1 rounded-material-small text-xs font-medium transition-colors flex items-center gap-1 ${
              importFormat === option.value
                ? "bg-material-primary text-material-text-primary shadow-material-1"
                : "text-material-text-secondary hover:text-material-text-primary hover:bg-material-surface"
            }`}
          >
            {option.icon}
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FormatToggle;
