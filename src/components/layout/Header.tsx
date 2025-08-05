import { Folder } from "lucide-react";

const Header = () => (
  <div className="bg-material-primary p-4 flex-shrink-0 shadow-material-2">
    <h1 className="text-xl font-bold text-material-text-primary flex items-center gap-2">
      <Folder className="w-5 h-5" />
      Tab Manager
    </h1>
    <p className="text-material-text-secondary text-sm mt-1">
      Organize and share your browser tabs
    </p>
  </div>
);

export default Header;
