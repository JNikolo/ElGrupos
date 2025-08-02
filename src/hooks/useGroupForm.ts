import { useState, useEffect, useCallback } from "react";
import type { GroupData } from "../services/types";

interface UseGroupFormProps {
  initialData?: GroupData;
  onSave: (data: GroupData) => Promise<void>;
  onClose: () => void;
}

export const useGroupForm = ({
  initialData,
  onSave,
  onClose,
}: UseGroupFormProps) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [selectedColor, setSelectedColor] = useState(
    initialData?.color || "grey"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update state when initialData changes (when switching between groups)
  useEffect(() => {
    setTitle(initialData?.title || "");
    setSelectedColor(initialData?.color || "grey");
  }, [initialData]);

  const handleClose = useCallback(() => {
    setTitle(initialData?.title || "");
    setSelectedColor(initialData?.color || "grey");
    setIsSubmitting(false);
    onClose();
  }, [initialData, onClose]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        color: selectedColor,
      });
      handleClose();
    } catch (error) {
      console.error("Error saving group:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [title, selectedColor, onSave, handleClose]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && e.ctrlKey) {
        handleSave();
      } else if (e.key === "Escape") {
        handleClose();
      }
    },
    [handleSave, handleClose]
  );

  const isValid = title.trim().length > 0;

  return {
    title,
    setTitle,
    selectedColor,
    setSelectedColor,
    isSubmitting,
    isValid,
    handleSave,
    handleClose,
    handleKeyDown,
  };
};
