import { useState, useEffect } from "react";
import { getFiles, fetchFolders, createFolder, uploadFile, deleteFile, downloadFile } from "../services/fileService";

export default function useFileManager() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [preview, setPreview] = useState(null);

  const token = localStorage.getItem("token");

  const loadFiles = async () => {
    const data = await getFiles(token);
    setFiles(data);
  };

  const loadFolders = async () => {
    const data = await fetchFolders(token);
    setFolders(data);
  };

  const handleCreateFolder = async (newFolder) => {
    if (!newFolder) return;
    const data = await createFolder(newFolder, currentFolder, token);
    if (data) {
      setFolders([...folders, data]);
    }
  };

  const handleUploadFile = async (file) => {
    if (!file) return;
    await uploadFile(file, currentFolder, token);
    await loadFiles();
  };

  const handleDeleteFile = async (id) => {
    await deleteFile(id, token);
    await loadFiles();
  };

  const handleDownloadFile = async (id) => {
    await downloadFile(id, token);
  };

  useEffect(() => {
    loadFiles();
    loadFolders();
  }, []);

  return {
    files,
    folders,
    currentFolder,
    setCurrentFolder,
    preview,
    setPreview,
    loadFiles,
    loadFolders,
    handleCreateFolder,
    handleUploadFile,
    handleDeleteFile,
    handleDownloadFile
  };
}