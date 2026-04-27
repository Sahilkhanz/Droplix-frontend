const BASE_URL = import.meta.env.VITE_API_URL;

// 📁 GET FILES
export const getFiles = async (token) => {
  const res = await fetch(`${BASE_URL}/api/files`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};

// 📂 GET FOLDERS
export const fetchFolders = async (token) => {
  const res = await fetch(`${BASE_URL}/api/files/folders`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await res.json();
};

// 📁 CREATE FOLDER / SUBFOLDER
export const createFolder = async (newFolder, currentFolder, token) => {
  if (!newFolder) return null;

  const res = await fetch(`${BASE_URL}/api/files/folder`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: newFolder,
      parent_id: currentFolder,
    }),
  });

  return await res.json();
};

// 📤 UPLOAD FILE (inside folder)
export const uploadFile = async (file, currentFolder, token) => {
  if (!file) return false;

  const formData = new FormData();
  formData.append("file", file);

  if (currentFolder) {
    formData.append("folder", currentFolder);
  }

  const response = await fetch(`${BASE_URL}/api/files/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  return response.ok;
};

// 🗑 DELETE
export const deleteFile = async (id, token) => {
  await fetch(`${BASE_URL}/api/files/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ⬇️ DOWNLOAD
export const downloadFile = async (id, token) => {
  const res = await fetch(`${BASE_URL}/api/files/download/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "file";
  a.click();
  window.URL.revokeObjectURL(url);
};