import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function Sidebar({
  onUpload,
  onNewFolder,
  currentFolder,
  onFolderSelect,
  onLogout,
  userEmail,
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMinimized, setIsMinimized] = useState(() => {
    // Load preference from localStorage
    return localStorage.getItem("sidebarMinimized") === "true";
  });
  const { theme } = useTheme();

  // Save minimized state to localStorage
  useEffect(() => {
    localStorage.setItem("sidebarMinimized", isMinimized);
  }, [isMinimized]);

  // Auto-expand on mobile when minimized
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && isMinimized) {
        setIsMinimized(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMinimized]);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <>
      {/* Mobile menu button */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
        >
          ☰
        </button>
      )}

      {/* Desktop minimize toggle button */}
      <button
        onClick={toggleMinimize}
        className="hidden md:block fixed top-4 left-64 z-50 p-1.5 bg-white dark:bg-gray-800 rounded-r-lg shadow-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        style={{ left: isMinimized ? "4rem" : "16rem" }}
        title={isMinimized ? "Expand sidebar" : "Minimize sidebar"}
      >
        {isMinimized ? "→" : "←"}
      </button>

      {/* Sidebar */}
      <div
        className={`
          ${isExpanded ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          fixed md:relative z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full transition-all duration-300
          ${isMinimized ? "md:w-20" : "md:w-64"}
        `}
      >
        <div
          className={`p-4 flex flex-col h-full ${isMinimized ? "items-center" : ""}`}
        >
          {/* Logo */}
          <div
            className={`mb-8 flex items-center ${isMinimized ? "justify-center" : "space-x-2"}`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex-shrink-0"></div>
            {!isMinimized && (
              <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Droplix
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div
            className={`space-y-2 mb-8 w-full ${isMinimized ? "flex flex-col items-center" : ""}`}
          >
            <button
              onClick={onUpload}
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                isMinimized ? "p-2" : "px-4 py-2"
              }`}
              title={isMinimized ? "Upload" : ""}
            >
              <span className="text-lg">📤</span>
              {!isMinimized && <span>Upload</span>}
            </button>
            <button
              onClick={onNewFolder}
              className={`w-full border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 rounded-lg flex items-center justify-center space-x-2 transition-colors dark:text-gray-200 ${
                isMinimized ? "p-2" : "px-4 py-2"
              }`}
              title={isMinimized ? "New Folder" : ""}
            >
              <span className="text-lg">📁</span>
              {!isMinimized && <span>New Folder</span>}
            </button>
          </div>

          {/* Navigation */}
          <nav
            className={`flex-1 space-y-1 w-full ${isMinimized ? "flex flex-col items-center" : ""}`}
          >
            <button
              onClick={() => onFolderSelect(null)}
              className={`w-full text-left rounded-lg flex items-center transition-colors ${
                isMinimized ? "justify-center p-2" : "px-3 py-2 space-x-3"
              } ${
                currentFolder === null
                  ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
              title={isMinimized ? "My Drive" : ""}
            >
              <span className="text-lg">🏠</span>
              {!isMinimized && <span>My Drive</span>}
            </button>

            <button
              className={`w-full text-left rounded-lg flex items-center transition-colors ${
                isMinimized ? "justify-center p-2" : "px-3 py-2 space-x-3"
              } hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`}
              title={isMinimized ? "Starred" : ""}
            >
              <span className="text-lg">⭐</span>
              {!isMinimized && <span>Starred</span>}
            </button>

            <button
              className={`w-full text-left rounded-lg flex items-center transition-colors ${
                isMinimized ? "justify-center p-2" : "px-3 py-2 space-x-3"
              } hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300`}
              title={isMinimized ? "Trash" : ""}
            >
              <span className="text-lg">🗑️</span>
              {!isMinimized && <span>Trash</span>}
            </button>
          </nav>

          {/* User Info at Bottom */}
          <div
            className={`pt-4 mt-auto border-t border-gray-200 dark:border-gray-700 w-full ${isMinimized ? "flex justify-center" : ""}`}
          >
            {isMinimized ? (
              <div
                className="relative group"
                title={userEmail?.split("@")[0] || "User"}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm cursor-pointer">
                  {userEmail?.charAt(0).toUpperCase() || "👤"}
                </div>
                {/* Tooltip on hover */}
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  {userEmail?.split("@")[0] || "User"}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">
                  {userEmail?.charAt(0).toUpperCase() || "👤"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {userEmail?.split("@")[0] || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {userEmail}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isExpanded && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}
