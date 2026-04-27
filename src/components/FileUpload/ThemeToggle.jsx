import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, setSystemTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleThemeChange = (newTheme) => {
    if (newTheme === "system") {
      setSystemTheme();
    } else if (newTheme === "light") {
      if (theme !== "light") toggleTheme();
    } else if (newTheme === "dark") {
      if (theme !== "dark") toggleTheme();
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        aria-label="Theme settings"
      >
        {theme === "light" && <span className="text-xl">☀️</span>}
        {theme === "dark" && <span className="text-xl">🌙</span>}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
          <button
            onClick={() => handleThemeChange("system")}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
          >
            <span>💻</span> System preference
          </button>
          <button
            onClick={() => handleThemeChange("light")}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
          >
            <span>☀️</span> Light mode
          </button>
          <button
            onClick={() => handleThemeChange("dark")}
            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 transition-colors"
          >
            <span>🌙</span> Dark mode
          </button>
        </div>
      )}
    </div>
  );
}
