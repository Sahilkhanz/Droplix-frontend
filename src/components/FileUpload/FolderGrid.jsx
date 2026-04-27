export default function FolderGrid({
  folders,
  onFolderClick,
  selectedItems,
  onSelect,
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className={`group relative bg-white rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer ${
            selectedItems.some(
              (item) => item.id === folder.id && item.type === "folder",
            )
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-300"
          }`}
          onDoubleClick={() => onFolderClick(folder.id)}
        >
          {/* Selection Checkbox */}
          <div
            className="absolute top-2 left-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(folder.id, "folder");
            }}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                selectedItems.some(
                  (item) => item.id === folder.id && item.type === "folder",
                )
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white border-gray-300"
              }`}
            >
              {selectedItems.some(
                (item) => item.id === folder.id && item.type === "folder",
              ) && <span className="text-white text-xs">✓</span>}
            </div>
          </div>

          <div className="p-4 pt-8">
            <div className="aspect-square flex items-center justify-center text-6xl">
              📁
            </div>
            <div className="mt-2 text-center">
              <p className="text-sm font-medium truncate" title={folder.name}>
                {folder.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
