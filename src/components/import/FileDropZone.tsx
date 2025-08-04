import { Upload, File } from "lucide-react";

interface FileDropZoneProps {
  selectedFile: File | null;
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragEnter: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onBrowseFiles: () => void;
  onRemoveFile: () => void;
}

const FileDropZone = ({
  selectedFile,
  isDragOver,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  onBrowseFiles,
  onRemoveFile,
}: FileDropZoneProps) => {
  return (
    <div
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={onBrowseFiles}
      className={`relative border-2 border-dashed rounded-material-medium p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragOver
          ? "border-material-primary bg-material-primary/5 scale-[1.02]"
          : "border-material-border hover:border-material-primary/50 hover:bg-material-elevated"
      } ${selectedFile ? "border-material-success bg-material-success/5" : ""}`}
    >
      {selectedFile ? (
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <File className="w-12 h-12 text-material-success" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-material-text-primary">
              {selectedFile.name}
            </p>
            <p className="text-xs text-material-text-secondary">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFile();
            }}
            className="text-xs text-material-text-secondary hover:text-material-text-primary underline"
          >
            Remove file
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-center">
            <Upload
              className={`w-12 h-12 transition-colors ${
                isDragOver
                  ? "text-material-primary"
                  : "text-material-text-secondary"
              }`}
            />
          </div>
          <div className="space-y-1">
            <p
              className={`text-sm font-medium transition-colors ${
                isDragOver
                  ? "text-material-primary"
                  : "text-material-text-primary"
              }`}
            >
              Drop your file here or click to browse
            </p>
            <p className="text-xs text-material-text-secondary">
              Supports JSON and Markdown files
            </p>
          </div>
        </div>
      )}
      {isDragOver && (
        <div className="absolute inset-0 bg-material-primary/10 rounded-material-medium pointer-events-none" />
      )}
    </div>
  );
};

export default FileDropZone;
