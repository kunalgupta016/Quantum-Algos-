import { Link, useLocation } from "react-router-dom";
import { APP_NAME, APP_ORG_SHORT, NAV_LINKS } from "../../utils/constants";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-[var(--color-app-surface)] border-b border-[var(--color-app-border)] px-6 py-3">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 group">
          {/* QL Shield Icon */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-app-accent)] to-[var(--color-app-accent-hover)] shadow-lg shadow-[rgba(199,169,78,0.15)]">
            <svg className="h-5 w-5 text-[var(--color-app-base)]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.67-3.13 9.03-7 10.2-3.87-1.17-7-5.53-7-10.2V6.3l7-3.12z"/>
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold tracking-wide text-[var(--color-app-text-main)] group-hover:text-[var(--color-app-primary)] transition-colors">
              {APP_NAME}
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.15em] text-[var(--color-app-accent-hover)]">
              {APP_ORG_SHORT}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-xs font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? "text-[var(--color-app-primary)] bg-[var(--color-app-primary-glow)]"
                    : "text-[var(--color-app-text-muted)] hover:text-[var(--color-app-text-main)] hover:bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[var(--color-app-primary)]" />
                )}
              </Link>
            );
          })}

          {/* Status indicator */}
          <div className="ml-4 flex items-center gap-2 rounded-lg border border-[var(--color-app-border)] bg-[var(--color-app-base)] px-3 py-1.5">
            <div className="app-pulse-dot" />
            <span className="text-xs font-medium text-[var(--color-app-text-muted)]">
              System Active
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
}
