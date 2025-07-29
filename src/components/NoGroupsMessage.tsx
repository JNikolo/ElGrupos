import { Folder } from "lucide-react";

const NoGroupsMessage = () => (
  <div className="text-center py-6 bg-white/5 rounded-xl border border-white/10">
    <Folder className="w-12 h-12 mx-auto text-gray-400 opacity-50 mb-2" />
    <p className="text-gray-400 text-sm mb-1">No tab groups found</p>
    <p className="text-gray-500 text-xs">Create tab groups in Chrome first</p>
  </div>
);

export default NoGroupsMessage;
