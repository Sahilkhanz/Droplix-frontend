export default function BackButton({ currentFolder, onBack }) {
  if (!currentFolder) return null;

  return <button onClick={onBack}>⬅ Back</button>;
}
