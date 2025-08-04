interface ImportButtonProps {
  loading: boolean;
  successMessage: string | null;
  onImport: () => void;
}

const ImportButton = ({
  loading,
  successMessage,
  onImport,
}: ImportButtonProps) => {
  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={onImport}
        disabled={loading || !!successMessage}
        className="px-4 py-2 bg-material-primary text-material-text-primary rounded-material-small disabled:opacity-60"
      >
        {loading ? "Importing..." : successMessage ? "Success!" : "Import"}
      </button>
    </div>
  );
};

export default ImportButton;
