import { useNavigate, useParams } from "react-router-dom";
import AlgorithmCard from "../AlgorithmCard/AlgorithmCard";
import { useAlgorithmContext } from "../../context/AlgorithmContext";
import { CATEGORIES } from "../../data/algorithms";

export default function Sidebar() {
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

  return (
    <aside className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col h-full">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Quantum Algorithms
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {sortedCategories.map((category) => (
          <div key={category} className="space-y-1">
            <h3 className="px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
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
