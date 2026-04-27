import { useState, useEffect, useCallback } from "react";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function PreviewModal({
  preview,
  onClose,
  files = [],
  currentFileId = null,
}) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [imageFiles, setImageFiles] = useState([]);

  // Find all image files in the current directory
  useEffect(() => {
    if (files && files.length > 0 && currentFileId) {
      // Filter only image files
      const images = files.filter((file) =>
        file.mimetype?.startsWith("image/"),
      );
      setImageFiles(images);

      // Find current index
      const index = images.findIndex((img) => img.id === currentFileId);
      setCurrentIndex(index);
    }
  }, [files, currentFileId]);

  // Load current image
  useEffect(() => {
    if (
      preview &&
      preview.type === "image" &&
      currentIndex >= 0 &&
      imageFiles[currentIndex]
    ) {
      setLoading(true);
      setError(null);

      const currentFile = imageFiles[currentIndex];
      const url = `${BASE_URL}/api/files/view/${currentFile.id}`;

      const img = new Image();
      img.onload = () => {
        setImageUrl(url);
        setLoading(false);
      };
      img.onerror = () => {
        setError("Failed to load image");
        setLoading(false);
      };
      img.src = url;
    } else if (preview && preview.type === "image" && currentIndex === -1) {
      // Single image preview (no gallery)
      setLoading(true);
      const img = new Image();
      img.onload = () => {
        setImageUrl(preview.url);
        setLoading(false);
      };
      img.onerror = () => {
        setError("Failed to load image");
        setLoading(false);
      };
      img.src = preview.url;
    }
  }, [preview, currentIndex, imageFiles]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (imageFiles.length > 0 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setImageUrl(null);
      setError(null);
    }
  }, [currentIndex, imageFiles.length]);

  const goToNext = useCallback(() => {
    if (imageFiles.length > 0 && currentIndex < imageFiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setImageUrl(null);
      setError(null);
    }
  }, [currentIndex, imageFiles.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!preview) return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          goToPrevious();
          break;
        case "ArrowRight":
          e.preventDefault();
          goToNext();
          break;
        case "Escape":
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [preview, goToPrevious, goToNext, onClose]);

  const handleDownload = () => {
    const url =
      currentIndex >= 0 && imageFiles[currentIndex]
        ? `${BASE_URL}/api/files/download/${imageFiles[currentIndex].id}`
        : preview?.url;

    if (url) {
      window.open(url, "_blank");
    }
  };

  if (!preview) return null;

  const hasGallery = imageFiles.length > 1;
  const currentFile = currentIndex >= 0 ? imageFiles[currentIndex] : null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
          <div className="text-white">
            {hasGallery && (
              <p className="text-sm">
                {currentIndex + 1} of {imageFiles.length}
              </p>
            )}
            {currentFile && (
              <p className="text-sm font-medium mt-1">{currentFile.filename}</p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              title="Download"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors text-white"
              title="Close (Esc)"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation Arrows */}
        {hasGallery && (
          <>
            {currentIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all z-10"
                title="Previous (←)"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
            )}

            {currentIndex < imageFiles.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all z-10"
                title="Next (→)"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </>
        )}

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-4">
          {loading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="mt-4 text-white">Loading preview...</p>
            </div>
          )}

          {error && (
            <div className="text-center text-red-400">
              <p className="text-lg">⚠️ {error}</p>
              <button
                onClick={handleDownload}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Download File Instead
              </button>
            </div>
          )}

          {!loading && !error && preview.type === "image" && imageUrl && (
            <div className="relative max-w-full max-h-full">
              <img
                src={imageUrl}
                alt="Preview"
                className="max-w-full max-h-[85vh] object-contain"
              />

              {/* Image counter badge */}
              {hasGallery && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 rounded-full text-white text-sm">
                  {currentIndex + 1} / {imageFiles.length}
                </div>
              )}
            </div>
          )}

          {!loading && !error && preview.type === "pdf" && (
            <iframe
              src={preview.url}
              className="w-full h-[85vh]"
              title="PDF Preview"
            />
          )}

          {!loading && !error && preview.type === "video" && (
            <video controls className="max-w-full max-h-[85vh]">
              <source src={preview.url} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Thumbnail strip for images */}
        {hasGallery && imageFiles.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
            <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
              {imageFiles.map((file, idx) => (
                <button
                  key={file.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setImageUrl(null);
                    setError(null);
                  }}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === currentIndex
                      ? "border-blue-500 scale-105"
                      : "border-white/50 hover:border-white"
                  }`}
                >
                  <img
                    src={`${BASE_URL}/api/files/view/${file.id}`}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {idx === currentIndex && (
                    <div className="absolute inset-0 bg-blue-500/20"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Instruction hint */}
        {hasGallery && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white/50 text-xs bg-black/50 px-3 py-1 rounded-full">
            ← → to navigate • Esc to close
          </div>
        )}
      </div>
    </div>
  );
}
