import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById } from "../../services/api";

// Simple helper to extract YouTube embed URL from various YT link formats
function getEmbedUrl(url) {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("watch?v=")[1]?.split("&")[0];
  } else if (url.includes("youtube.com/embed/")) {
    return url;
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

export default function CourseViewerPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await getCourseById(id);
        setCourse(data);
      } catch (err) {
        console.error("Failed to load course:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourse();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen pt-24 text-center text-[var(--color-app-text-muted)] animate-pulse">Loading course details...</div>;
  }

  if (!course) {
    return <div className="min-h-screen pt-24 text-center text-[var(--color-app-text-muted)]">Course not found.</div>;
  }

  const currentLecture = course.lectures?.[currentLectureIndex];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto">
      
      {/* Video Player Section */}
      <div className="flex-1">
        <Link to="/courses" className="text-sm font-semibold text-[var(--color-app-primary)] hover:underline mb-4 inline-block">
          &larr; Back to Courses
        </Link>
        <h1 className="text-3xl font-extrabold text-[var(--color-app-text-main)] mb-2">{course.title}</h1>
        <p className="text-[var(--color-app-text-muted)] mb-8">{course.description}</p>
        
        {currentLecture ? (
          <div className="app-glass p-2 rounded-2xl border border-[var(--color-app-border)] shadow-xl overflow-hidden">
            <div className="relative w-full pb-[56.25%] bg-black rounded-xl overflow-hidden">
              <iframe 
                className="absolute top-0 left-0 w-full h-full"
                src={getEmbedUrl(currentLecture.videoUrl)} 
                title={currentLecture.title} 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[var(--color-app-text-main)] mb-2">
                {currentLectureIndex + 1}. {currentLecture.title}
              </h2>
              <div className="text-sm font-semibold text-[var(--color-app-text-muted)]">
                Duration: {currentLecture.duration || "N/A"}
              </div>
            </div>
          </div>
        ) : (
          <div className="app-glass p-12 text-center rounded-2xl border border-[var(--color-app-border)] text-[var(--color-app-text-muted)]">
            No lectures available for this course yet.
          </div>
        )}
      </div>

      {/* Lectures Sidebar */}
      <div className="w-full md:w-80 shrink-0">
        <div className="app-glass p-6 rounded-2xl border border-[var(--color-app-border)] sticky top-24 max-h-[calc(100vh-8rem)] flex flex-col">
          <h3 className="text-lg font-bold text-[var(--color-app-text-main)] mb-4">Course Content</h3>
          <div className="text-sm font-semibold text-[var(--color-app-primary)] mb-4 pb-4 border-b border-[var(--color-app-border)]">
            {course.lectures?.length || 0} Lectures
          </div>
          
          <div className="overflow-y-auto flex-1 pr-2 space-y-2 custom-scrollbar">
            {course.lectures?.map((lec, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentLectureIndex(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col gap-1 ${
                  idx === currentLectureIndex 
                    ? "bg-[var(--color-app-primary)]/10 border-[var(--color-app-primary)]" 
                    : "bg-[var(--color-app-base)] border-transparent hover:border-[var(--color-app-border)] hover:bg-[var(--color-app-surface)]"
                }`}
              >
                <span className={`text-sm font-bold ${idx === currentLectureIndex ? "text-[var(--color-app-primary)]" : "text-[var(--color-app-text-main)]"}`}>
                  {idx + 1}. {lec.title}
                </span>
                <span className="text-xs font-semibold text-[var(--color-app-text-muted)]">
                  {lec.duration || "Video"}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
