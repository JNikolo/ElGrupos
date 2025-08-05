import type { ReactNode } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
}

const Tooltip = ({ content, children }: TooltipProps) => {
  return (
    <div className="relative inline-block" title={content}>
      {children}
    </div>
  );
};

export default Tooltip;
