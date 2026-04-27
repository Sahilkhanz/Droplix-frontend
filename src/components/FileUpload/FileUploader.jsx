import { useRef } from "react";

export default function FileUploader({ onFileSelect, onUpload }) {
  const fileInputRef = useRef(null);

  const handleUpload = () => {
    onUpload();
    // Clear file input after upload
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <h3>Upload File</h3>
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => onFileSelect(e.target.files[0])}
      />
      <button onClick={handleUpload}>Upload</button>
    </>
  );
}
