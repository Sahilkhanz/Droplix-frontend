import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FileUpload from "./components/FileUpload/FileUpload";
import { ThemeProvider } from "./context/ThemeContext";
// import { useTheme } from "./context/ThemeContext";

// // Inside your component
// const { theme, toggleTheme, setSystemTheme } = useTheme();

// // Debug logging
// useEffect(() => {
//   console.log("Current theme:", theme);
//   console.log("HTML class:", document.documentElement.classList);
//   console.log("LocalStorage theme:", localStorage.getItem("theme"));
// }, [theme]);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleAuthenticated = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loader"></div>
        <style>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          .loader {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <FileUpload onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onAuthenticated={handleAuthenticated} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register onAuthenticated={handleAuthenticated} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import FileUpload from "./components/FileUpload/FileUpload"; // Adjust path as needed

// function App() {
//   const token = localStorage.getItem("token");

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={token ? <FileUpload /> : <Login />} />
//         <Route path="/register" element={<Register />} />
//       </Routes>
//     </BrowserRouter>
//     // <h1 className="text-3xl text-green-500">Tailwind Working</h1>
//   );
// }

// export default App;
