export default function Breadcrumb({ currentFolder, folders, onNavigate }) {
  const getBreadcrumbs = () => {
    if (!currentFolder) return [{ id: null, name: "My Drive" }];

    const crumbs = [];
    let folderId = currentFolder;

    while (folderId) {
      const folder = folders.find((f) => f.id == folderId);
      if (folder) {
        crumbs.unshift({ id: folder.id, name: folder.name });
        folderId = folder.parent_id;
      } else {
        break;
      }
    }

    return [{ id: null, name: "My Drive" }, ...crumbs];
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="px-6 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.id} className="flex items-center">
            {index > 0 && <span className="text-gray-400 mx-2">/</span>}
            <button
              onClick={() => onNavigate(crumb.id)}
              className={`hover:text-blue-600 transition-colors ${
                index === breadcrumbs.length - 1
                  ? "text-gray-700 font-medium"
                  : "text-gray-500"
              }`}
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
