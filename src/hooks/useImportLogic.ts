import { useState } from "react";

export type ImportFormat = "text" | "file";

export const useImportLogic = (onImport: (data: string) => Promise<void>) => {
  const [loading, setLoading] = useState(false);
  const [importFormat, setImportFormat] = useState<ImportFormat>("text");
  const [textInput, setTextInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleTextChange = (text: string) => {
    setTextInput(text);
    clearMessages();
  };

  const handleFormatChange = (format: ImportFormat) => {
    setImportFormat(format);
    clearMessages();
  };

  const executeImport = async (content: string) => {
    setLoading(true);
    clearMessages();

    try {
      const trimmed = content.trim();
      if (!trimmed) {
        setErrorMessage("Please provide some content to import.");
        return;
      }

      await onImport(trimmed);
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

  return {
    loading,
    importFormat,
    textInput,
    errorMessage,
    successMessage,
    clearMessages,
    handleTextChange,
    handleFormatChange,
    executeImport,
  };
};
