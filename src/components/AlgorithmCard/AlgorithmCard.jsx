export default function AlgorithmCard({ algorithm, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-3 py-2 rounded text-xs transition-colors block ${
        isActive
          ? "bg-blue-50 text-blue-700 font-medium border border-blue-200"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent"
      }`}
    >
      <div className="font-semibold">{algorithm.name}</div>
      <div className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">
        {algorithm.shortDescription}
      </div>
    </button>
  );
}
