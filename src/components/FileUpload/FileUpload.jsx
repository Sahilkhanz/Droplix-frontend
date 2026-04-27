import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Breadcrumb from "./Breadcrumb";
import FolderGrid from "./FolderGrid";
import FileGrid from "./FileGrid";
import FileList from "./FileList";
import ViewToggle from "./ViewToggle";
import PreviewModal from "./PreviewModal";
import UploadModal from "./UploadModal";
import CreateFolderModal from "./CreateFolderModal";
import {
  getFiles,
  fetchFolders,
  createFolder,
  uploadFile,
  deleteFile,
  downloadFile,
} from "../../services/fileService";
import { getFilteredFiles, getVisibleFolders } from "../../utils/fileUtils";
import useFileManager from "../../hooks/useFileManager";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function FileUpload({ onLogout }) {
  const [viewMode, setViewMode] = useState(() => {
    // Load saved view mode from localStorage
    return localStorage.getItem("viewMode") || "grid";
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [preview, setPreview] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const {
    files,
    folders,
    currentFolder,
    setCurrentFolder,
    loadFiles,
    loadFolders,
    handleCreateFolder,
    handleUploadFile,
    handleDeleteFile,
    handleDownloadFile,
  } = useFileManager();

  // Add state for sidebar minimized (or use context)
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(() => {
    return localStorage.getItem("sidebarMinimized") === "true";
  });

  // Add this effect to listen for sidebar changes
  useEffect(() => {
    const handleStorageChange = () => {
      setIsSidebarMinimized(
        localStorage.getItem("sidebarMinimized") === "true",
      );
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Pass this to Sidebar and use it for layout

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Save view mode to localStorage
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // Get user email from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserEmail(payload.email || payload.sub || "user@example.com");
      } catch (error) {
        console.error("Failed to decode token:", error);
        setUserEmail("user@example.com");
      }
    }
  }, []);

  // Preview function
  const handlePreview = (previewData) => {
    console.log("Preview data received:", previewData);

    // If previewData is a file object (old format), convert it
    if (previewData && previewData.id && !previewData.type) {
      let type = "other";
      if (previewData.mimetype?.startsWith("image/")) {
        type = "image";
      } else if (previewData.mimetype === "application/pdf") {
        type = "pdf";
      } else if (previewData.mimetype?.startsWith("video/")) {
        type = "video";
      }

      previewData = {
        type: type,
        url: `${BASE_URL}/api/files/view/${previewData.id}`,
        filename: previewData.filename,
        mimetype: previewData.mimetype,
        fileId: previewData.id,
      };
    }

    setPreview(previewData);
  };

  const handleClosePreview = () => {
    setPreview(null);
  };

  const filteredFiles = getFilteredFiles(files, currentFolder);
  const visibleFolders = getVisibleFolders(folders, currentFolder);

  const searchedFiles = filteredFiles.filter((f) =>
    f.filename?.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const searchedFolders = visibleFolders.filter((f) =>
    f.name?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleItemSelect = (id, type) => {
    setSelectedItems((prev) => {
      const exists = prev.find((item) => item.id === id && item.type === type);
      if (exists) {
        return prev.filter((item) => !(item.id === id && item.type === type));
      } else {
        return [...prev, { id, type }];
      }
    });
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedItems.length} item(s)?`)) {
      for (const item of selectedItems) {
        if (item.type === "file") {
          await handleDeleteFile(item.id);
        }
      }
      setSelectedItems([]);
    }
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
  };

  // Auto switch to list view on mobile if in grid mode
  useEffect(() => {
    if (isMobile && viewMode === "grid") {
      setViewMode("list");
    }
  }, [isMobile]);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      <Sidebar
        onUpload={() => setShowUploadModal(true)}
        onNewFolder={() => setShowFolderModal(true)}
        currentFolder={currentFolder}
        onFolderSelect={setCurrentFolder}
        onLogout={handleLogoutClick}
        userEmail={userEmail}
        onMinimizeChange={setIsSidebarMinimized}
      />
      <div
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          !isSidebarMinimized ? "md:ml-0" : "md:ml-0"
        }`}
      >
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCount={selectedItems.length}
            onBulkDelete={handleBulkDelete}
            onLogout={handleLogoutClick}
            userEmail={userEmail}
          />

          <Breadcrumb
            currentFolder={currentFolder}
            folders={folders}
            onNavigate={setCurrentFolder}
          />

          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">
            {/* View Toggle - Hide on mobile if needed */}
            <div className="mb-4">
              <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
            </div>

            {/* Folders Section - Fix this part */}
            {searchedFolders.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Folders ({searchedFolders.length})
                </h2>
                {viewMode === "grid" && !isMobile ? (
                  <FolderGrid
                    folders={searchedFolders}
                    onFolderClick={setCurrentFolder}
                    selectedItems={selectedItems}
                    onSelect={handleItemSelect}
                  />
                ) : (
                  <FileList
                    files={searchedFolders} // Make sure this is 'files' not 'items'
                    type="folder"
                    onItemClick={setCurrentFolder}
                    selectedItems={selectedItems}
                    onSelect={handleItemSelect}
                  />
                )}
              </div>
            )}

            {/* Files Section - Fix this part */}
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
                Files ({searchedFiles.length})
              </h2>
              {searchedFiles.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-500 dark:text-gray-400">
                    No files found
                  </p>
                  {(searchQuery || currentFolder) && (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setCurrentFolder(null);
                      }}
                      className="mt-2 text-blue-500 hover:text-blue-600 text-sm"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : viewMode === "grid" && !isMobile ? (
                <FileGrid
                  files={searchedFiles}
                  onPreview={handlePreview}
                  onDownload={handleDownloadFile}
                  onDelete={handleDeleteFile}
                  selectedItems={selectedItems}
                  onSelect={handleItemSelect}
                />
              ) : (
                <FileList
                  files={searchedFiles} // This should already be 'files', keep as is
                  type="file"
                  onPreview={handlePreview}
                  onDownload={handleDownloadFile}
                  onDelete={handleDeleteFile}
                  selectedItems={selectedItems}
                  onSelect={handleItemSelect}
                />
              )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <UploadModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onUpload={async (file) => {
            await handleUploadFile(file);
            setShowUploadModal(false);
          }}
        />

        <CreateFolderModal
          isOpen={showFolderModal}
          onClose={() => setShowFolderModal(false)}
          onCreate={async (folderName) => {
            await handleCreateFolder(folderName);
            setShowFolderModal(false);
          }}
        />

        {/* Preview Modal */}
        <PreviewModal
          preview={preview}
          onClose={handleClosePreview}
          files={searchedFiles}
          currentFileId={preview?.fileId}
        />
      </div>
    </div>
  );
}
// import { useState, useEffect } from "react";

// const BASE_URL = import.meta.env.VITE_API_URL;

// export default function FileUpload() {
//   const [file, setFile] = useState(null);
//   const [files, setFiles] = useState([]);
//   const [folders, setFolders] = useState([]);
//   const [newFolder, setNewFolder] = useState("");
//   const [currentFolder, setCurrentFolder] = useState(null);
//   const [preview, setPreview] = useState(null);

//   const token = localStorage.getItem("token");

//   // 📁 GET FILES
//   const getFiles = async () => {
//     const res = await fetch(`${BASE_URL}/api/files`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     setFiles(data);
//   };

//   // 📂 GET FOLDERS
//   const fetchFolders = async () => {
//     const res = await fetch(`${BASE_URL}/api/files/folders`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const data = await res.json();
//     setFolders(data);
//   };

//   // 📁 CREATE FOLDER / SUBFOLDER
//   const createFolder = async () => {
//     if (!newFolder) return;

//     const res = await fetch(`${BASE_URL}/api/files/folder`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({
//         name: newFolder,
//         parent_id: currentFolder, // 🔥 subfolder support
//       }),
//     });

//     const data = await res.json();
//     setFolders([...folders, data]);
//     setNewFolder("");
//   };

//   // 📤 UPLOAD FILE (inside folder)
//   const uploadFile = async () => {
//     if (!file) return;

//     const formData = new FormData();
//     formData.append("file", file);

//     if (currentFolder) {
//       formData.append("folder", currentFolder); // 🔥 important
//     }

//     await fetch(`${BASE_URL}/api/files/upload`, {
//       method: "POST",
//       headers: { Authorization: `Bearer ${token}` },
//       body: formData,
//     });

//     getFiles();
//   };

//   // 🗑 DELETE
//   const deleteFile = async (id) => {
//     await fetch(`${BASE_URL}/api/files/${id}`, {
//       method: "DELETE",
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     getFiles();
//   };

//   // ⬇️ DOWNLOAD
//   const downloadFile = async (id) => {
//     const res = await fetch(`${BASE_URL}/api/files/download/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "file";
//     a.click();
//   };

//   // 👁 PREVIEW
//   const previewFile = (file) => {
//     const url = `${BASE_URL}/api/files/view/${file.id}`;

//     if (file.mimetype.startsWith("image")) {
//       setPreview({ type: "image", url });
//     } else if (file.mimetype === "application/pdf") {
//       setPreview({ type: "pdf", url });
//     } else {
//       window.open(url);
//     }
//   };

//   // 📂 FILTER FILES BY FOLDER
//   const filteredFiles = files.filter((f) => {
//     if (!currentFolder) return f.folder === "root";
//     return f.folder === String(currentFolder);
//   });

//   // 📁 FILTER FOLDERS BY PARENT
//   const visibleFolders = folders.filter((f) => {
//     if (!currentFolder) return f.parent_id === null;
//     return f.parent_id == currentFolder;
//   });

//   useEffect(() => {
//     getFiles();
//     fetchFolders();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>📂 File Manager</h2>

//       {/* 🔙 BACK BUTTON */}
//       {currentFolder && (
//         <button onClick={() => setCurrentFolder(null)}>⬅ Back</button>
//       )}

//       {/* 📁 CREATE FOLDER */}
//       <div>
//         <input
//           placeholder="New folder"
//           value={newFolder}
//           onChange={(e) => setNewFolder(e.target.value)}
//         />
//         <button onClick={createFolder}>Create Folder</button>
//       </div>

//       {/* 📂 FOLDERS */}
//       <h3>Folders</h3>
//       <ul>
//         {visibleFolders.map((f) => (
//           <li key={f.id} onClick={() => setCurrentFolder(f.id)}>
//             📁 {f.name}
//           </li>
//         ))}
//       </ul>

//       {/* 📤 UPLOAD */}
//       <h3>Upload File</h3>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button onClick={uploadFile}>Upload</button>

//       {/* 📄 FILES */}
//       <h3>Files</h3>
//       <ul>
//         {filteredFiles.map((f) => (
//           <li key={f.id}>
//             {f.filename}

//             <button onClick={() => previewFile(f)}>👁</button>
//             <button onClick={() => downloadFile(f.id)}>⬇</button>
//             <button onClick={() => deleteFile(f.id)}>🗑</button>
//           </li>
//         ))}
//       </ul>

//       {/* 👁 PREVIEW MODAL */}
//       {preview && (
//         <div
//           style={{
//             position: "fixed",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             background: "rgba(0,0,0,0.7)",
//           }}
//         >
//           <div
//             style={{
//               background: "#fff",
//               padding: "20px",
//               margin: "50px auto",
//               width: "60%",
//             }}
//           >
//             <h3>Preview</h3>

//             {preview.type === "image" && (
//               <img src={preview.url} style={{ width: "100%" }} />
//             )}

//             {preview.type === "pdf" && (
//               <iframe src={preview.url} width="100%" height="500px"></iframe>
//             )}

//             <button onClick={() => setPreview(null)}>Close</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
