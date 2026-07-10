import { useNavigate, useParams } from "react-router-dom";
import AlgorithmCard from "../AlgorithmCard/AlgorithmCard";
import { useAlgorithmContext } from "../../context/AlgorithmContext";
import { CATEGORIES } from "../../data/algorithms";

export default function Sidebar({ isOpen, onToggle }) {
  const { algorithmList } = useAlgorithmContext();
  const navigate = useNavigate();
  const { id } = useParams();

  // Group algorithms by category
  const grouped = algorithmList.reduce((acc, algo) => {
    const cat = algo.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(algo);
    return acc;
  }, {});

  const categoryOrder = Object.values(CATEGORIES);
  const sortedCategories = Object.keys(grouped).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  const handleSelect = (algorithmId) => {
    navigate(`/algorithm/${algorithmId}`);
  };

  if (!isOpen) {
    return (
      <aside className="w-14 border-r border-[var(--color-app-border)] bg-[var(--color-app-surface)] flex flex-col h-full items-center py-4 shrink-0">
        <button 
          onClick={onToggle} 
          className="text-[var(--color-app-text-muted)] hover:text-white p-2 rounded-lg hover:bg-[var(--color-app-surface-hover)] bg-[var(--color-app-base)] border border-[var(--color-app-border)]"
          title="Open Sidebar"
        >
           <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
           </svg>
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r border-[var(--color-app-border)] bg-[var(--color-app-surface)] flex flex-col h-full shrink-0">
      <div className="border-b border-[var(--color-app-border)] px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-app-accent)]">
            Quantum Algorithms
          </h2>
          <p className="mt-0.5 text-xs text-[var(--color-app-text-muted)]">
            {algorithmList.length} algorithms available
          </p>
        </div>
        <button 
          onClick={onToggle} 
          className="text-[var(--color-app-text-muted)] hover:text-white p-1.5 rounded-lg hover:bg-[var(--color-app-surface-hover)]"
          title="Collapse Sidebar"
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {sortedCategories.map((category) => (
          <div key={category} className="space-y-1">
            <h3 className="px-2 pt-1 text-xs font-bold uppercase tracking-[0.15em] text-[var(--color-app-text-muted)]">
              {category}
            </h3>
            <div className="space-y-0.5">
              {grouped[category].map((algo) => (
                <AlgorithmCard
                  key={algo.id}
                  algorithm={algo}
                  isActive={id === algo.id}
                  onClick={() => handleSelect(algo.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
