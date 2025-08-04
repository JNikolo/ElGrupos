import { useState } from "react";

export const useShareModal = () => {
  const [shareGroup, setShareGroup] =
    useState<chrome.tabGroups.TabGroup | null>(null);

  const openModal = (group: chrome.tabGroups.TabGroup) => {
    setShareGroup(group);
  };

  const closeModal = () => {
    setShareGroup(null);
  };

  return {
    shareGroup,
    isOpen: shareGroup !== null,
    openModal,
    closeModal,
  };
};
