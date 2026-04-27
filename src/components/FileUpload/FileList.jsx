const BASE_URL = import.meta.env.VITE_API_URL;

export default function FileList({ files, onPreview, onDownload, onDelete }) {
  if (files.length === 0) return null;

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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handlePreview = (file) => {
    // Determine file type for preview
    let type = "other";
    if (file.mimetype?.startsWith("image/")) {
      type = "image";
    } else if (file.mimetype === "application/pdf") {
      type = "pdf";
    } else if (file.mimetype?.startsWith("video/")) {
      type = "video";
    }

    // Create preview object with file info
    const previewData = {
      type: type,
      url: `${BASE_URL}/api/files/view/${file.id}`,
      filename: file.filename,
      mimetype: file.mimetype,
      fileId: file.id,
    };

    onPreview(previewData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Name
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Size
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {files.map((file) => (
              <tr
                key={file.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                onDoubleClick={() => handlePreview(file)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 text-2xl">
                      {getFileIcon(file.mimetype, file.filename)}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {file.filename}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {file.mimetype?.split("/")[1]?.toUpperCase() || "FILE"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatFileSize(file.size)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(file.createdAt || file.uploadDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreview(file);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors p-1 rounded"
                      title="Preview"
                    >
                      👁️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDownload(file.id);
                      }}
                      className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors p-1 rounded"
                      title="Download"
                    >
                      ⬇️
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            `Are you sure you want to delete "${file.filename}"?`,
                          )
                        ) {
                          onDelete(file.id);
                        }
                      }}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors p-1 rounded"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
