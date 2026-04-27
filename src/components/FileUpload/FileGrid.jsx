const BASE_URL = import.meta.env.VITE_API_URL;

export default function FileGrid({
  files,
  onPreview,
  onDownload,
  onDelete,
  selectedItems,
  onSelect,
}) {
  const getFileIcon = (mimetype, filename) => {
    if (mimetype?.startsWith("image/")) return "🖼️";
    if (mimetype === "application/pdf") return "📄";
    if (mimetype?.startsWith("video/")) return "🎥";
    if (mimetype?.startsWith("audio/")) return "🎵";
    if (filename?.endsWith(".doc") || filename?.endsWith(".docx")) return "📝";
    if (filename?.endsWith(".xls") || filename?.endsWith(".xlsx")) return "📊";
    if (filename?.endsWith(".ppt") || filename?.endsWith(".pptx")) return "📽️";
    if (filename?.endsWith(".txt")) return "📃";
    if (filename?.endsWith(".zip") || filename?.endsWith(".rar")) return "🗜️";
    return "📎";
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const getPreviewUrl = (fileId) => {
    return `${BASE_URL}/api/files/view/${fileId}`;
  };

  const handlePreview = (file) => {
    // Determine file type
    let type = "other";
    if (file.mimetype?.startsWith("image/")) {
      type = "image";
    } else if (file.mimetype === "application/pdf") {
      type = "pdf";
    } else if (file.mimetype?.startsWith("video/")) {
      type = "video";
    }

    // Create preview object with file ID
    const previewData = {
      type: type,
      url: getPreviewUrl(file.id),
      filename: file.filename,
      mimetype: file.mimetype,
      fileId: file.id, // ← Add this line
    };

    console.log("Calling onPreview with:", previewData);
    onPreview(previewData);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className={`group relative bg-white dark:bg-gray-800 rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer ${
            selectedItems.some(
              (item) => item.id === file.id && item.type === "file",
            )
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
              : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
          }`}
        >
          {/* Selection Checkbox */}
          <div
            className="absolute top-2 left-2 z-10"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(file.id, "file");
            }}
          >
            <div
              className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                selectedItems.some(
                  (item) => item.id === file.id && item.type === "file",
                )
                  ? "bg-blue-500 border-blue-500"
                  : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              }`}
            >
              {selectedItems.some(
                (item) => item.id === file.id && item.type === "file",
              ) && <span className="text-white text-xs">✓</span>}
            </div>
          </div>

          {/* File Preview/Icon */}
          <div className="p-4 pt-8" onDoubleClick={() => handlePreview(file)}>
            <div className="aspect-square flex items-center justify-center text-6xl">
              {file.mimetype?.startsWith("image/") ? (
                <img
                  src={getPreviewUrl(file.id)}
                  alt={file.filename}
                  className="w-full h-full object-cover rounded"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.parentElement.innerHTML = getFileIcon(
                      file.mimetype,
                      file.filename,
                    );
                  }}
                />
              ) : (
                <span>{getFileIcon(file.mimetype, file.filename)}</span>
              )}
            </div>
            <div className="mt-2 text-center">
              <p
                className="text-sm font-medium truncate text-gray-900 dark:text-gray-100"
                title={file.filename}
              >
                {file.filename}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(file);
                }}
                className="p-1 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                title="Preview"
              >
                👁️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload(file.id);
                }}
                className="p-1 bg-white dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
                title="Download"
              >
                ⬇️
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm("Are you sure you want to delete this file?")) {
                    onDelete(file.id);
                  }
                }}
                className="p-1 bg-white dark:bg-gray-700 rounded hover:bg-red-100 dark:hover:bg-red-900"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
