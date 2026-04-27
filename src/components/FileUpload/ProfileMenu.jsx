import { useState, useEffect } from "react";

export default function ProfileMenu({ userEmail, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    // Extract name from email
    if (userEmail) {
      const name = userEmail.split("@")[0];
      setUserName(name);
    }
  }, [userEmail]);

  const getInitials = () => {
    if (userName) {
      return userName.charAt(0).toUpperCase();
    }
    return "👤";
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      >
        {getInitials()}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
            {/* Profile Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                  {getInitials()}
                </div>
                <div>
                  <p className="font-semibold">{userName || "User"}</p>
                  <p className="text-sm opacity-90">{userEmail}</p>
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Account email
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {userEmail}
              </p>
            </div>

            {/* Logout Button */}
            <button
              onClick={() => {
                onLogout();
                setIsOpen(false);
              }}
              className="w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2"
            >
              <span>🚪</span> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
