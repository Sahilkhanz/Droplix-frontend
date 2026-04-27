import { useState, useEffect } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function FileList({
  files = [],
  type = "file",
  onPreview,
  onDownload,
  onDelete,
  onItemClick,
  selectedItems = [],
  onSelect,
}) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Debug log to see what data we're getting
  console.log("FileList received:", {
    type,
    filesCount: files.length,
    firstItem: files[0],
  });

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-lg">
        No {type === "folder" ? "folders" : "files"} found
      </div>
    );
  }

  const getFileIcon = (item) => {
    if (type === "folder") return "📁";

    const mimetype = item.mimetype;
    const filename = item.filename || item.name;

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

  const getItemName = (item) => {
    if (type === "folder") {
      return item.name || "Unnamed Folder";
    }
    return item.filename || item.name || "Unnamed File";
  };

  const formatFileSize = (bytes) => {
    if (!bytes || type === "folder") return "—";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleItemClick = (item) => {
    if (type === "folder" && onItemClick) {
      console.log("Folder clicked:", item.id, item.name);
      onItemClick(item.id);
    } else if (type === "file" && onPreview) {
      let previewType = "other";
      if (item.mimetype?.startsWith("image/")) {
        previewType = "image";
      } else if (item.mimetype === "application/pdf") {
        previewType = "pdf";
      } else if (item.mimetype?.startsWith("video/")) {
        previewType = "video";
      }

      onPreview({
        type: previewType,
        url: `${BASE_URL}/api/files/view/${item.id}`,
        filename: item.filename,
        mimetype: item.mimetype,
        fileId: item.id,
      });
    }
  };

  const handleSelect = (e, id) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(id, type);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10"
              >
                <input
                  type="checkbox"
                  checked={
                    selectedItems.length === files.length && files.length > 0
                  }
                  onChange={(e) => {
                    if (e.target.checked) {
                      files.forEach((file) => onSelect?.(file.id, type));
                    } else {
                      files.forEach((file) => onSelect?.(file.id, type));
                    }
                  }}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Name
              </th>
              {type === "file" && (
                <>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Size
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  >
                    Date
                  </th>
                </>
              )}
              {type === "folder" && (
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                >
                  Type
                </th>
              )}
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {files.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer group"
                onClick={() => handleItemClick(item)}
              >
                {/* Checkbox */}
                <td className="px-4 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedItems.some(
                      (i) => i.id === item.id && i.type === type,
                    )}
                    onChange={(e) => handleSelect(e, item.id)}
                    onClick={(e) => e.stopPropagation()}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                  />
                </td>

                {/* Name with Icon */}
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 text-2xl">
                      {getFileIcon(item)}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {getItemName(item)}
                      </div>
                      {type === "file" && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {item.mimetype?.split("/")[1]?.toUpperCase() ||
                            "FILE"}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                {/* Size (files only) */}
                {type === "file" && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatFileSize(item.size)}
                  </td>
                )}

                {/* Date (files only) */}
                {type === "file" && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(item.createdAt || item.uploadDate)}
                  </td>
                )}

                {/* Type (folders only) */}
                {type === "folder" && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    Folder
                  </td>
                )}

                {/* Actions */}
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    {type === "file" && onPreview && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleItemClick(item);
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                        title="Preview"
                      >
                        👁️
                      </button>
                    )}
                    {type === "file" && onDownload && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDownload(item.id);
                        }}
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                        title="Download"
                      >
                        ⬇️
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (
                            window.confirm(`Delete "${getItemName(item)}"?`)
                          ) {
                            onDelete(item.id);
                          }
                        }}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors p-1 rounded opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden">
        {files.map((item) => (
          <div
            key={item.id}
            className="p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <input
                  type="checkbox"
                  checked={selectedItems.some(
                    (i) => i.id === item.id && i.type === type,
                  )}
                  onChange={(e) => handleSelect(e, item.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded border-gray-300 dark:border-gray-600"
                />
                <div className="text-3xl">{getFileIcon(item)}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {getItemName(item)}
                  </p>
                  {type === "file" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatFileSize(item.size)}
                    </p>
                  )}
                  {type === "folder" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Folder
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                {type === "file" && onPreview && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleItemClick(item);
                    }}
                    className="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    👁️
                  </button>
                )}
                {type === "file" && onDownload && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(item.id);
                    }}
                    className="p-2 text-green-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                  >
                    ⬇️
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete "${getItemName(item)}"?`)) {
                        onDelete(item.id);
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
