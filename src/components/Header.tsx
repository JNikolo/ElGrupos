import { Folder } from "lucide-react";

const Header = () => (
  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex-shrink-0">
    <h1 className="text-xl font-bold text-white flex items-center gap-2">
      <Folder className="w-5 h-5" />
      Tab Manager
    </h1>
    <p className="text-purple-100 text-sm mt-1">
      Organize and copy your browser tabs
    </p>
  </div>
);

export default Header;
