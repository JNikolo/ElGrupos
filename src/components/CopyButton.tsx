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
        className="flex-shrink-0 p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
        title="Copy link"
      >
        {isCopied ? (
          <Check className="w-3 h-3 text-green-400" />
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
      className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md font-medium transition-colors ${
        isCopied
          ? "bg-green-600 text-white"
          : "bg-green-600 hover:bg-green-700 text-white"
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
