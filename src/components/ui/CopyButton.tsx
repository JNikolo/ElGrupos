import { useState } from "react";
import { Copy, Check, AlertCircle } from "lucide-react";
import Tooltip from "./Tooltip";

interface CopyButtonProps {
  textToCopy: string;
  id: string;
  isIcon?: boolean;
}

const CopyButton = ({ textToCopy, id, isIcon = false }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setError(false);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  if (isIcon) {
    const getTooltipContent = () => {
      if (error) return "Failed to copy";
      if (isCopied) return "Copied!";
      return "Copy link";
    };

    const getIcon = () => {
      if (error) return <AlertCircle className="w-3 h-3 text-material-error" />;
      if (isCopied) return <Check className="w-3 h-3 text-material-success" />;
      return <Copy className="w-3 h-3" />;
    };

    return (
      <Tooltip content={getTooltipContent()}>
        <button
          id={id}
          onClick={copy}
          className="flex-shrink-0 p-1 text-material-text-secondary hover:text-material-text-primary hover:bg-material-elevated rounded-material-small transition-colors duration-[var(--animate-material-fast)]"
        >
          {getIcon()}
        </button>
      </Tooltip>
    );
  }

  const getButtonContent = () => {
    if (error) {
      return (
        <>
          <AlertCircle className="w-3 h-3" />
          Failed
        </>
      );
    }
    if (isCopied) {
      return (
        <>
          <Check className="w-3 h-3" />
          Copied!
        </>
      );
    }
    return (
      <>
        <Copy className="w-3 h-3" />
        Copy All
      </>
    );
  };

  const getButtonStyles = () => {
    if (error)
      return "bg-material-error hover:bg-red-600 text-material-text-primary";
    if (isCopied) return "bg-material-success text-material-text-primary";
    return "bg-material-secondary hover:bg-material-secondary-dark text-material-text-primary";
  };

  return (
    <Tooltip
      content={
        error
          ? "Copy failed - try again"
          : isCopied
          ? "Successfully copied!"
          : "Copy all links"
      }
    >
      <button
        id={id}
        onClick={copy}
        className={`flex items-center gap-1 px-2 py-1 text-xs rounded-material-small font-medium transition-colors duration-[var(--animate-material-fast)] shadow-material-1 ${getButtonStyles()}`}
      >
        {getButtonContent()}
      </button>
    </Tooltip>
  );
};

export default CopyButton;
