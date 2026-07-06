export default function OutputConsole({ output }) {
  if (!output) return null;

  return (
    <div className="rounded border border-gray-200 bg-white p-4">
      <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
        <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Console Output
      </h4>

      <div className="rounded border border-gray-200 bg-gray-50 p-3 font-mono text-xs leading-relaxed max-w-2xl overflow-x-auto">
        {output.split("\n").map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className="select-none text-gray-400">
              {String(i + 1).padStart(2, " ")}
            </span>
            <span
              className={
                line.includes("✓") || line.includes("successful")
                  ? "text-green-700"
                  : line.includes("Error") || line.includes("✗")
                  ? "text-red-700"
                  : "text-gray-800"
              }
            >
              {line || "\u00A0"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
