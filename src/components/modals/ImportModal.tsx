import ImportGroup from "../import/ImportGroup";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: string) => Promise<void>;
}

const ImportModal = ({ isOpen, onClose, onImport }: ImportModalProps) => {
  if (!isOpen) return null;

  const handleImport = async (data: string) => {
    try {
      await onImport(data);
      // Small delay to show success before closing
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      // Error handling is done in the hook, modal will stay open
      console.error("Import failed:", error);
    }
  };

  return <ImportGroup handleClose={onClose} onImport={handleImport} />;
};

export default ImportModal;
