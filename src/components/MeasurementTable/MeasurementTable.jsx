export default function MeasurementTable({ measurements }) {
  if (!measurements || measurements.length === 0) return null;

  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M3 6h18M3 18h18" />
        </svg>
        Measurement Results
      </h4>

      <div className="overflow-x-auto rounded border border-gray-200 max-w-2xl">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-2 font-bold text-gray-600">
                State
              </th>
              <th className="px-4 py-2 font-bold text-gray-600">
                Probability
              </th>
              <th className="px-4 py-2 font-bold text-gray-600">
                Count
              </th>
              <th className="px-4 py-2 font-bold text-gray-600 w-1/3">
                Distribution
              </th>
            </tr>
          </thead>
          <tbody>
            {measurements.map((m, i) => (
              <tr
                key={i}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-4 py-2 font-mono text-gray-800">
                  {m.state}
                </td>
                <td className="px-4 py-2 font-mono text-gray-700">
                  {(m.probability * 100).toFixed(1)}%
                </td>
                <td className="px-4 py-2 font-mono text-gray-500">
                  {m.count}
                </td>
                <td className="px-4 py-2">
                  <div className="h-2 w-full rounded bg-gray-100 overflow-hidden">
                    <div
                      className="h-full bg-blue-500 transition-all duration-500"
                      style={{ width: `${m.probability * 100}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
