export default function FormulaCard({ formula, timeComplexity, spaceComplexity }) {
  return (
    <div className="rounded border border-gray-200 bg-gray-50 p-4">
      {formula && (
        <div className="mb-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Formula
          </h4>
          <p className="font-mono text-sm text-gray-800">{formula}</p>
        </div>
      )}

      <div className="flex gap-4">
        {timeComplexity && (
          <div>
            <span className="text-xs text-gray-500">Time Complexity: </span>
            <span className="text-xs font-mono font-bold text-gray-800">
              {timeComplexity}
            </span>
          </div>
        )}
        {spaceComplexity && (
          <div>
            <span className="text-xs text-gray-500">Space Complexity: </span>
            <span className="text-xs font-mono font-bold text-gray-800">
              {spaceComplexity}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
