import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from './image/moim_logo.png';
import '../styles/home.css';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef(null);

  const linkClass = ({ isActive }) =>
    `nav__link ${isActive ? "nav__link--active" : "nav__link"}`;

  const mobileLinkClass = ({ isActive }) =>
    `nav__mobileLink ${isActive ? "nav__mobileLink--active" : ""}`;

  const displayName =
    user?.user_metadata?.username || user?.email?.split("@")[0] || "Profile";

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleOutsideClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [menuOpen]);

  return (
    <header className="nav" ref={navRef}>
      <div className="nav__inner">
        <div className="nav__left">
          <NavLink to="/" className={linkClass}>
            <img src={logo} alt="Moim Logo" className="nav_logo" />
          </NavLink>
        </div>

        <nav className="nav__center">
          <NavLink to="/study" className={linkClass}>Study</NavLink>
          <NavLink to="/sports" className={linkClass}>Sport</NavLink>
          <NavLink to="/hobby" className={linkClass}>Hobby</NavLink>
        </nav>

        <div className="nav__right">
          {!loading && user ? (
            <button
              className="btn btn--ghost"
              onClick={() => navigate("/profile")}>
              {displayName}
            </button>
          ) : (
            <button
              className="nav__loginBtn"
              onClick={() => navigate("/login")}>
              Login
            </button>
          )}

          <button
            className={`nav__burger ${menuOpen ? "nav__burger--open" : ""}`}
            onClick={toggleMenu}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className="nav__burgerLine" />
            <span className="nav__burgerLine" />
            <span className="nav__burgerLine" />
          </button>
        </div>
      </div>

      <nav className={`nav__mobile ${menuOpen ? "nav__mobile--open" : ""}`}>
        <NavLink to="/study" className={mobileLinkClass}>Study</NavLink>
        <NavLink to="/sports" className={mobileLinkClass}>Sport</NavLink>
        <NavLink to="/hobby" className={mobileLinkClass}>Hobby</NavLink>
      </nav>
    </header>
  );
}
