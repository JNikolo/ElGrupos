import { Import } from "lucide-react";
import Modal from "../ui/Modal";
import FormatToggle from "./FormatToggle";
import TextInput from "./TextInput";
import FileDropZone from "./FileDropZone";
import StatusMessages from "./StatusMessages";
import ImportButton from "./ImportButton";
import { useImportLogic } from "../../hooks/useImportLogic";
import { useFileUpload } from "../../hooks/useFileUpload";

interface ImportGroupModalProps {
  handleClose: () => void;
  onImport: (data: string) => Promise<void>; // Made async for better error handling
}

const ImportGroup = ({ handleClose, onImport }: ImportGroupModalProps) => {
  // Import logic hook
  const {
    loading,
    importFormat,
    textInput,
    errorMessage,
    successMessage,
    handleTextChange,
    handleFormatChange,
    executeImport,
  } = useImportLogic(onImport);

  // File upload hook
  const {
    selectedFile,
    isDragOver,
    fileInputRef,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    handleFileInputChange,
    handleBrowseFiles,
    handleRemoveFile,
    readFileContent,
  } = useFileUpload();

  const handleImport = async () => {
    if (importFormat === "text") {
      await executeImport(textInput);
    } else if (selectedFile) {
      try {
        const fileContent = await readFileContent(selectedFile);
        await executeImport(fileContent);
      } catch (err) {
        console.error("File read error:", err);
      }
    }
  };

  return (
    <Modal
      handleClose={handleClose}
      loading={loading}
      icon={<Import className="w-5 h-5" />}
      title="Import Group"
    >
      <FormatToggle
        importFormat={importFormat}
        onFormatChange={handleFormatChange}
      />

      <div className="space-y-4 relative">
        <StatusMessages
          loading={loading}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />

        {importFormat === "text" ? (
          <TextInput value={textInput} onChange={handleTextChange} />
        ) : (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.md"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <FileDropZone
              selectedFile={selectedFile}
              isDragOver={isDragOver}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onBrowseFiles={handleBrowseFiles}
              onRemoveFile={handleRemoveFile}
            />
          </div>
        )}
      </div>

      <ImportButton
        loading={loading}
        successMessage={successMessage}
        onImport={handleImport}
      />
    </Modal>
  );
};

export default ImportGroup;
