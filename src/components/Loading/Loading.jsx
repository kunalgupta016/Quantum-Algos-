
/**
 * Full-screen loading overlay with animated spinner.
 *
 * @param {boolean} visible — controls visibility
 * @param {string}  message — optional status message
 */
export default function Loading({ visible = false, message = "Running quantum simulation..." }) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-gray-900/90 px-10 py-8 shadow-2xl">
        {/* Animated quantum rings */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-violet-500" style={{ animationDuration: "1s" }} />
          <div className="absolute inset-1 animate-spin rounded-full border-2 border-transparent border-t-cyan-400" style={{ animationDuration: "1.5s", animationDirection: "reverse" }} />
          <div className="absolute inset-2 animate-spin rounded-full border-2 border-transparent border-t-emerald-400" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 animate-pulse rounded-full bg-violet-400" />
          </div>
        </div>

        <p className="text-sm font-medium text-gray-300">{message}</p>
        <p className="text-xs text-gray-500">Processing qubits...</p>
      </div>
    </div>
  );
}
