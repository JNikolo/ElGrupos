import GroupEditor from "../groups/GroupEditor";
import type { GroupData } from "../../services/types";

interface GroupEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (groupData: GroupData) => Promise<void>;
  initialData?: GroupData;
  mode: "create" | "edit";
}

const GroupEditorModal = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  mode,
}: GroupEditorModalProps) => {
  if (!isOpen) return null;

  return (
    <GroupEditor
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
      mode={mode}
    />
  );
};

export default GroupEditorModal;
