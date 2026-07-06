import { useNavigate } from "react-router-dom";
import { useAlgorithmContext } from "../../context/AlgorithmContext";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from "../../utils/constants";
import { CATEGORIES } from "../../data/algorithms";

export default function Home() {
  const { algorithmList } = useAlgorithmContext();
  const navigate = useNavigate();

  const categoryCount = new Set(algorithmList.map((a) => a.category)).size;

  return (
    <div className="flex-1 overflow-y-auto bg-white text-gray-850 px-6 py-10 max-w-4xl">
      {/* Header Area */}
      <header className="mb-10 pb-6 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
          {APP_NAME}
        </h1>
        <p className="text-md text-gray-500 font-medium">
          {APP_TAGLINE}
        </p>
        <p className="mt-3 text-sm text-gray-600 leading-relaxed max-w-2xl">
          {APP_DESCRIPTION}
        </p>

        {/* Stats Row */}
        <div className="mt-6 flex gap-6 text-xs text-gray-500">
          <div>
            Total Algorithms: <span className="font-bold text-gray-800">{algorithmList.length}</span>
          </div>
          <div>
            Categories: <span className="font-bold text-gray-800">{categoryCount}</span>
          </div>
        </div>
      </header>

      {/* Categories Grid */}
      <section className="space-y-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          All Algorithms
        </h2>

        {Object.values(CATEGORIES).map((category) => {
          const algos = algorithmList.filter((a) => a.category === category);
          if (algos.length === 0) return null;

          return (
            <div key={category} className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 pb-1">
                {category}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2">
                {algos.map((algo) => (
                  <AlgoGridCard
                    key={algo.id}
                    algorithm={algo}
                    onClick={() => navigate(`/algorithm/${algo.id}`)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────── */

function AlgoGridCard({ algorithm, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 rounded border border-gray-250 bg-gray-50 hover:bg-white hover:border-blue-500 hover:shadow-sm transition-all duration-200 block w-full cursor-pointer"
    >
      <h4 className="text-sm font-bold text-gray-800 hover:text-blue-600">
        {algorithm.name}
      </h4>
      <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
        {algorithm.shortDescription}
      </p>

      <div className="mt-3 flex gap-2 font-mono text-[9px] text-gray-400">
        <span className="bg-white px-1.5 py-0.5 rounded border border-gray-250">
          {algorithm.timeComplexity}
        </span>
        <span className="bg-white px-1.5 py-0.5 rounded border border-gray-250">
          {algorithm.spaceComplexity}
        </span>
      </div>
    </button>
  );
}
