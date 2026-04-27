import ThemeToggle from "./ThemeToggle";
import ProfileMenu from "./ProfileMenu";

export default function Header({
  searchQuery,
  onSearchChange,
  selectedCount,
  onBulkDelete,
  onLogout,
  userEmail,
}) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-3 transition-colors">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
            <span className="absolute left-3 top-2.5 text-gray-400 dark:text-gray-500">
              🔍
            </span>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center space-x-4 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
            <span className="text-sm text-red-600 dark:text-red-400">
              {selectedCount} selected
            </span>
            <button
              onClick={onBulkDelete}
              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
            >
              Delete All
            </button>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <ProfileMenu userEmail={userEmail} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
