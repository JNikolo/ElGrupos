import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
  id: string;
  isIcon?: boolean;
}

const CopyButton = ({ textToCopy, id, isIcon = false }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (isIcon) {
    return (
      <button
        id={id}
        onClick={copy}
        className="flex-shrink-0 p-1 text-material-text-secondary hover:text-material-text-primary hover:bg-material-elevated rounded-material-small transition-colors duration-[var(--animate-material-fast)]"
        title="Copy link"
      >
        {isCopied ? (
          <Check className="w-3 h-3 text-material-success" />
        ) : (
          <Copy className="w-3 h-3" />
        )}
      </button>
    );
  }

  return (
    <button
      id={id}
      onClick={copy}
      className={`flex items-center gap-1 px-2 py-1 text-xs rounded-material-small font-medium transition-colors duration-[var(--animate-material-fast)] shadow-material-1 ${
        isCopied
          ? "bg-material-success text-material-text-primary"
          : "bg-material-secondary hover:bg-material-secondary-dark text-material-text-primary"
      }`}
    >
      {isCopied ? (
        <>
          <Check className="w-3 h-3" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-3 h-3" />
          Copy All
        </>
      )}
    </button>
  );
};

export default CopyButton;
