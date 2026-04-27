export const getFilteredFiles = (files, currentFolder) => {
  return files.filter((f) => {
    if (!currentFolder) return f.folder === "root";
    return f.folder === String(currentFolder);
  });
};

export const getVisibleFolders = (folders, currentFolder) => {
  return folders.filter((f) => {
    if (!currentFolder) return f.parent_id === null;
    return f.parent_id == currentFolder;
  });
};

export const getPreviewUrl = (fileId) => {
  return `${import.meta.env.VITE_API_URL}/api/files/view/${fileId}`;
};

export const getPreviewType = (mimetype) => {
  if (mimetype?.startsWith("image")) return "image";
  if (mimetype === "application/pdf") return "pdf";
  return null;
};