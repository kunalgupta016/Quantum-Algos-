import { useLayoutEffect, useRef } from "react";
import renderMathInElement from "katex/dist/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function MathHTMLContainer({ html, onImageClick }) {
  const containerRef = useRef(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = html;
      
      if (onImageClick) {
        const images = containerRef.current.querySelectorAll("img");
        images.forEach(img => {
          // If the image is inside a link, let the link handle the click
          if (img.closest('a')) {
            return;
          }
          img.style.cursor = "zoom-in";
          img.onclick = (e) => {
            e.preventDefault();
            onImageClick(img.src);
          };
        });
      }

      try {
        renderMathInElement(containerRef.current, {
          delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "$", right: "$", display: false },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
          ],
          throwOnError: false,
        });
      } catch (e) {
        console.error("KaTeX error:", e);
      }
    }
  }, [html, onImageClick]);

  return (
    <>
      <div 
        ref={containerRef} 
        className="math-html-content w-full overflow-hidden break-words"
        style={{
          wordBreak: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      />
      <style>{`
        .math-html-content p {
          white-space: pre-wrap !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
        }
      `}</style>
    </>
  );
}
