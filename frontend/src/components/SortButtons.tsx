import React from "react";

type SortOption = {
  value: string;
  label: string;
};

type SortButtonsProps = {
  sortBy: string;
  sortOrder: "asc" | "desc";
  onSortChange: (newSortBy: string) => void;
  options: SortOption[];
};

const SortButtons: React.FC<SortButtonsProps> = ({ sortBy, sortOrder, onSortChange, options }) => {
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onSortChange(option.value)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition ${
            sortBy === option.value
              ? "bg-indigo-500 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {option.label}
          {sortBy === option.value && (
            <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default SortButtons; 