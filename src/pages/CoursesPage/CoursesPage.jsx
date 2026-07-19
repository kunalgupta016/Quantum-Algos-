import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/api";
import { motion } from "framer-motion";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await getCourses();
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-extrabold text-[var(--color-app-text-main)] mb-6"
          >
            Free Quantum <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">Courses & Lectures</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[var(--color-app-text-muted)] max-w-3xl mx-auto"
          >
            Learn quantum computing from experts with our curated video lectures.
          </motion.p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-[var(--color-app-text-muted)] animate-pulse">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20 text-[var(--color-app-text-muted)]">No courses available at the moment.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                key={course._id} 
                className="app-glass rounded-2xl border border-[var(--color-app-border)] hover:border-[var(--color-app-primary)] transition-all overflow-hidden flex flex-col group"
              >
                {course.thumbnail ? (
                  <div className="h-48 overflow-hidden">
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-green-500/20 to-emerald-600/20 flex items-center justify-center">
                    <span className="text-4xl">🎓</span>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-[var(--color-app-text-main)] mb-2 line-clamp-2">{course.title}</h3>
                  <p className="text-sm text-[var(--color-app-text-muted)] mb-4 line-clamp-3 flex-1">{course.description}</p>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-[var(--color-app-border)]">
                    <div className="text-xs font-semibold text-[var(--color-app-text-muted)]">
                      👨‍🏫 {course.instructor || "Admin"} <br />
                      📺 {course.lectures?.length || 0} Lectures
                    </div>
                    <Link 
                      to={`/courses/${course._id}`}
                      className="px-4 py-2 bg-[var(--color-app-primary)] text-white text-sm font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
                    >
                      Start Learning
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
