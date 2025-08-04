import { X, Edit3, BookOpenText, FileJson, Upload, File, Loader2 } from "lucide-react";
import { useState, useRef } from "react";

interface ImportGroupModalProps {
  handleClose: () => void;
  onImport: (data: string) => Promise<void>; // Made async for better error handling
}

const ImportGroupModal = ({ handleClose, onImport }: ImportGroupModalProps) => {
  const [loading, setLoading] = useState(false);
  const [importFormat, setImportFormat] = useState<"text" | "file">("text");
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (file: File) => {
    return (
      file.type === "application/json" ||
      file.name.endsWith(".md") ||
      file.name.endsWith(".json")
    );
  };

  const handleFileSelect = (file: File) => {
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setErrorMessage(null);
      setSuccessMessage(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setSuccessMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImport = async () => {
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (importFormat === "text") {
        const trimmed = textInput.trim();
        if (!trimmed) {
          setErrorMessage("Please provide some content to import.");
          return;
        }
        await onImport(trimmed);
      } else if (selectedFile) {
        const reader = new FileReader();

        const fileContent = await new Promise<string>((resolve, reject) => {
          reader.onload = () => {
            const result = reader.result?.toString();
            if (result) {
              resolve(result);
            } else {
              reject(new Error("Failed to read the file content."));
            }
          };
          reader.onerror = () => {
            reject(new Error("Error reading file."));
          };
          reader.readAsText(selectedFile);
        });

        await onImport(fileContent);
      } else {
        setErrorMessage("No file selected.");
        return;
      }

      // Success
      setSuccessMessage("Groups imported successfully!");
    } catch (err) {
      console.error("Import error:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Import failed. Please check your data format and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-material-overlay flex items-center justify-center z-50 p-4">
      <div className="bg-material-surface border border-material-border rounded-material-large shadow-material-8 w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-material-primary" />
              <h3 className="text-lg font-semibold text-material-text-primary">
                Import Group
              </h3>
              {loading && (
                <Loader2 className="w-4 h-4 text-material-primary animate-spin" />
              )}
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-material-text-secondary hover:text-material-text-primary hover:bg-material-elevated rounded-material-small transition-colors"
              aria-label="Close import modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Format Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium text-material-text-secondary">
              Import as:
            </span>
            <div className="flex bg-material-elevated rounded-material-medium p-1">
              {[
                {
                  label: "Text",
                  icon: <BookOpenText className="w-3 h-3" />,
                  value: "text",
                },
                {
                  label: "File",
                  icon: <FileJson className="w-3 h-3" />,
                  value: "file",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() =>
                    setImportFormat(option.value as "text" | "file")
                  }
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

          {/* Content */}
          <div className="space-y-4 relative">
            {loading && (
              <div className="absolute inset-0 bg-material-overlay/50 rounded-material-medium z-10 flex items-center justify-center">
                <div className="bg-material-surface px-4 py-2 rounded-material-medium shadow-material-4 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-material-primary animate-spin" />
                  <span className="text-sm text-material-text-primary">Importing...</span>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="p-3 bg-material-error/10 border border-material-error/20 rounded-material-medium">
                <p className="text-sm text-material-error">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-material-success/10 border border-material-success/20 rounded-material-medium">
                <p className="text-sm text-material-success">
                  {successMessage}
                </p>
              </div>
            )}

            {importFormat === "text" ? (
              <div className="border border-material-border rounded-material-medium overflow-hidden">
                <textarea
                  className="w-full p-3 bg-material-surface text-material-text-primary text-xs font-mono border-0 focus:outline-none resize-none scrollbar-custom"
                  placeholder='Paste your group data here. Supports JSON and Markdown formats.

JSON example:
{
  "title": "My Group",
  "color": "blue",
  "tabs": [
    {"title": "Google", "url": "https://google.com"}
  ]
}

Alternative JSON format:
{
  "groupTitle": "My Group",
  "tabs": [
    {"title": "Google", "url": "https://google.com"}
  ]
}

Markdown example:
# My Group
- [Google](https://google.com)
- [GitHub](https://github.com)'
                  style={{ lineHeight: "1.4" }}
                  rows={18}
                  value={textInput}
                  onChange={(e) => {
                    setTextInput(e.target.value);
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.md"
                  onChange={handleFileInputChange}
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleBrowseFiles}
                  className={`relative border-2 border-dashed rounded-material-medium p-8 text-center cursor-pointer transition-all duration-200 ${
                    isDragOver
                      ? "border-material-primary bg-material-primary/5 scale-[1.02]"
                      : "border-material-border hover:border-material-primary/50 hover:bg-material-elevated"
                  } ${
                    selectedFile
                      ? "border-material-success bg-material-success/5"
                      : ""
                  }`}
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
                          handleRemoveFile();
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
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleImport}
              disabled={loading || !!successMessage}
              className="px-4 py-2 bg-material-primary text-material-text-primary rounded-material-small disabled:opacity-60"
            >
              {loading
                ? "Importing..."
                : successMessage
                ? "Success!"
                : "Import"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportGroupModal;
