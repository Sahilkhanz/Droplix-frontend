export default function ViewToggle({ viewMode, onViewChange }) {
  return (
    <div className="flex justify-end space-x-2 mb-4">
      <button
        onClick={() => onViewChange("grid")}
        className={`p-2 rounded-lg transition-colors ${
          viewMode === "grid"
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
        }`}
        title="Grid view"
      >
        ⊞
      </button>
      <button
        onClick={() => onViewChange("list")}
        className={`p-2 rounded-lg transition-colors ${
          viewMode === "list"
            ? "bg-blue-100 text-blue-600"
            : "hover:bg-gray-100"
        }`}
        title="List view"
      >
        ☰
      </button>
    </div>
  );
}
