import React, { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [systemTheme, setSystemThemeState] = useState("light");

  // Detect system theme
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemThemeState(mediaQuery.matches ? "dark" : "light");

    const handler = (e) => {
      setSystemThemeState(e.matches ? "dark" : "light");
      // If using system preference, update theme
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "system" || !savedTheme) {
        setTheme(e.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "system") {
      setTheme(systemTheme);
    } else if (savedTheme === "dark") {
      setTheme("dark");
    } else if (savedTheme === "light") {
      setTheme("light");
    } else {
      // Default to system preference
      setTheme(systemTheme);
      localStorage.setItem("theme", "system");
    }
  }, [systemTheme]);

  // Apply theme to document
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const setSystemTheme = () => {
    setTheme(systemTheme);
    localStorage.setItem("theme", "system");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setSystemTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
