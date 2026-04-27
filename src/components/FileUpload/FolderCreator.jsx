import { useState } from "react";

export default function FolderCreator({ onCreateFolder }) {
  const [newFolder, setNewFolder] = useState("");

  const handleSubmit = () => {
    onCreateFolder(newFolder);
    setNewFolder("");
  };

  return (
    <div>
      <input
        placeholder="New folder"
        value={newFolder}
        onChange={(e) => setNewFolder(e.target.value)}
      />
      <button onClick={handleSubmit}>Create Folder</button>
    </div>
  );
}
