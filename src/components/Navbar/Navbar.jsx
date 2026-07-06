import { Link, useLocation } from "react-router-dom";
import { APP_NAME } from "../../utils/constants";

export default function Navbar() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gray-800">{APP_NAME}</span>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className={`text-sm ${
              isHome ? "font-semibold text-blue-600" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Home
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-500 hover:text-gray-800"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
