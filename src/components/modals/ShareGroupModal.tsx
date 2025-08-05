import ShareGroup from "../share/ShareGroup";

interface ShareGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupId: number;
}

const ShareGroupModal = ({
  isOpen,
  onClose,
  groupId,
}: ShareGroupModalProps) => {
  if (!isOpen || !groupId) return null;

  return <ShareGroup groupId={groupId} handleClose={onClose} />;
};

export default ShareGroupModal;
