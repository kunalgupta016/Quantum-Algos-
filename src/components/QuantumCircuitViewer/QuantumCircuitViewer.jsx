import { useState } from "react";
import ImageLightbox from "../ImageLightbox/ImageLightbox";

export default function QuantumCircuitViewer({ circuitData }) {
  const [showFullView, setShowFullView] = useState(false);

  if (!circuitData || typeof circuitData !== "string") {
    return (
      <div className="rounded border border-gray-200 bg-white p-4">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quantum Circuit
        </h4>
        <div className="flex h-32 items-center justify-center text-sm text-gray-400 italic">
          No circuit available for this algorithm.
        </div>
      </div>
    );
  }

  const imgSrc = circuitData.startsWith("data:image") ? circuitData : `data:image/png;base64,${circuitData}`;

  return (
    <>
      <div className="rounded border border-gray-200 bg-white p-4">
        <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quantum Circuit
        </h4>

        <div
          className="flex justify-center p-2 bg-white overflow-x-auto cursor-zoom-in group"
          onClick={() => setShowFullView(true)}
          title="Click to view full size"
        >
          <img
            src={imgSrc}
            alt="Quantum Circuit"
            className="max-w-full h-auto transition-transform duration-200 group-hover:scale-[1.02] group-hover:shadow-md"
          />
        </div>

        <p className="mt-2 text-[10px] text-gray-400 text-center">
          Click image to expand
        </p>
      </div>

      {showFullView && (
        <ImageLightbox
          src={imgSrc}
          alt="Quantum Circuit — Full View"
          onClose={() => setShowFullView(false)}
        />
      )}
    </>
  );
}
