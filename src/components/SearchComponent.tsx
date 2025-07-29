import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchComponentProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  onClear?: () => void;
  disabled?: boolean;
}

const SearchComponent = ({
  placeholder = "Search tabs and groups...",
  onSearch,
  onClear,
  disabled = false,
}: SearchComponentProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Call onSearch callback if provided
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      handleClear();
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-material-text-secondary" />
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-2.5 bg-material-surface border border-material-border rounded-material-medium text-material-text-primary placeholder-material-text-disabled text-sm transition-all duration-[var(--animate-material-fast)] focus:outline-none focus:ring-2 focus:ring-material-primary focus:border-material-primary hover:border-material-primary shadow-material-1 ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        />
        {searchQuery && !disabled && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-material-text-secondary hover:text-material-text-primary transition-colors duration-[var(--animate-material-fast)] p-0.5 rounded-material-small hover:bg-material-elevated"
            title="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search suggestions/results container - for future use */}
      {searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-material-surface border border-material-border rounded-material-medium shadow-material-4 z-50 max-h-64 overflow-y-auto hidden">
          {/* Search results will be implemented later */}
          <div className="p-3 text-material-text-secondary text-sm">
            Search functionality coming soon...
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
