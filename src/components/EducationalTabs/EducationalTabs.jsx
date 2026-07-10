import { useState, useEffect, useRef } from "react";
import { educationalContent } from "../../data/educationalContent";
import Prism from "prismjs";
import "prismjs/components/prism-python";

// 1. Import KaTeX CSS and the auto-render function
import "katex/dist/katex.min.css";
import renderMathInElement from "katex/dist/contrib/auto-render";

const TABS = [
  { id: "description", label: "Description" },
  { id: "problemDescription", label: "Problem Definition" },
  { id: "algorithm", label: "Algorithm Details" },
  { id: "geometricProof", label: "Geometric Proof" },
  { id: "algebraicProof", label: "Algebraic Proof" },
  { id: "code", label: "Code" },
];

export default function EducationalTabs({ algorithmId }) {
  const [activeTab, setActiveTab] = useState(TABS[0].id);
  
  // 2. Create a ref to attach to the content container
  const contentRef = useRef(null);

  useEffect(() => {
    // Highlight Code
    if (activeTab === "code") {
      Prism.highlightAll();
    }

    // 3. Render Math in the current tab content
    if (contentRef.current) {
      renderMathInElement(contentRef.current, {
        delimiters: [
          { left: "$$", right: "$$", display: true },  // For block equations
          { left: "$", right: "$", display: false },   // For inline math
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true }
        ],
        throwOnError: false, // Prevents your app from crashing if there's a LaTeX typo
      });
    }
  }, [activeTab, algorithmId]); // Re-run when tab or algorithm changes

  const content = educationalContent[algorithmId] || educationalContent["default"];

  return (
    <div className="mb-10 app-glass rounded-xl overflow-hidden shadow-lg bg-white/70">
      {/* Header Tabs */}
      <div className="flex border-b border-[var(--color-app-border)] overflow-x-auto custom-scrollbar bg-[var(--color-app-surface-alt)]/30">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-6 py-4 text-sm font-bold transition-all border-b-2 ${
                isActive
                  ? "border-[var(--color-app-primary)] text-[var(--color-app-primary)] bg-white/50"
                  : "border-transparent text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text-main)] hover:bg-white/30"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {/* 4. Attach the ref to this wrapper div so KaTeX knows where to scan */}
      <div ref={contentRef} className="p-6 md:p-8 min-h-[300px]">
        {activeTab === "description" && (
          <div className="prose prose-sm md:prose-base max-w-none text-[var(--color-app-text-main)] leading-relaxed">
            <div dangerouslySetInnerHTML={{ __html: content.description }} />
            
            {content.applications && (
              <div className="mt-8">
                <h4 className="font-bold mb-3 text-[var(--color-app-accent)] uppercase tracking-widest text-xs">Applications</h4>
                <ul className="list-disc pl-5 space-y-2 text-[var(--color-app-text-main)]">
                  {content.applications.map((app, idx) => (
                    <li key={idx}>{app}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {content.limitations && (
              <div className="mt-8">
                <h4 className="font-bold mb-3 text-[var(--color-app-error)] uppercase tracking-widest text-xs">Limitations</h4>
                <ul className="list-disc pl-5 space-y-2 text-[var(--color-app-text-main)]">
                  {content.limitations.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {activeTab === "problemDescription" && (
          <div 
            className="prose prose-sm md:prose-base max-w-none text-[var(--color-app-text-main)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.problemDescription }} 
          />
        )}

        {activeTab === "algorithm" && (
          <div 
            className="prose prose-sm md:prose-base max-w-none text-[var(--color-app-text-main)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.algorithm }} 
          />
        )}

        {activeTab === "geometricProof" && (
          <div 
            className="prose prose-sm md:prose-base max-w-none text-[var(--color-app-text-main)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.geometricProof }} 
          />
        )}

        {activeTab === "algebraicProof" && (
          <div 
            className="prose prose-sm md:prose-base max-w-none text-[var(--color-app-text-main)] leading-relaxed"
            dangerouslySetInnerHTML={{ __html: content.algebraicProof }} 
          />
        )}

        {activeTab === "code" && (
          <div className="rounded-lg overflow-hidden bg-[#1d1f21]">
            <pre className="!m-0 !p-4 !bg-transparent text-sm">
              <code className="language-python">
                {content.code || "# Code implementation not available yet for this algorithm.\n# Check the Sandbox to write your own!"}
              </code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}