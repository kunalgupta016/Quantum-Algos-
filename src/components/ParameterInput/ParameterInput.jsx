export default function ParameterInput({ parameters, values, onChange }) {
  if (!parameters || parameters.length === 0) {
    return (
      <p className="text-sm text-gray-400 italic">
        This algorithm has no configurable parameters.
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 max-w-2xl">
      {parameters.map((param) => (
        <div key={param.name} className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-gray-600">
            {param.name}
          </label>

          {param.type === "select" ? (
            <select
              value={values[param.name] ?? param.default ?? ""}
              onChange={(e) => onChange(param.name, e.target.value)}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {param.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={param.type || "text"}
              value={values[param.name] ?? ""}
              onChange={(e) =>
                onChange(
                  param.name,
                  param.type === "number"
                    ? Number(e.target.value)
                    : e.target.value
                )
              }
              placeholder={param.placeholder || ""}
              min={param.min}
              max={param.max}
              step={param.step}
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          )}
        </div>
      ))}
    </div>
  );
}
