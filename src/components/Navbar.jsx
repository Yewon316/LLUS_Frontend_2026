import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from './image/moim_logo.png';
import '../styles/home.css';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const linkClass = ({ isActive }) =>
    `nav__link ${isActive ? "nav__link--active" : "nav__link"}`;

  const displayName =
    user?.user_metadata?.username || user?.email?.split("@")[0] || "Profile";

  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__left">
           <NavLink to="/" className={linkClass}>
            <img src={logo} alt="Moim Logo" className="nav_logo" />  
          </NavLink>
        </div>

        <nav className="nav__center">
          <NavLink to="/study" className={linkClass}>
            Study
          </NavLink>
          <NavLink to="/project" className={linkClass}>
            Project
          </NavLink>
          <NavLink to="/sports" className={linkClass}>
            Sport
          </NavLink>
          <NavLink to="/hobby" className={linkClass}>
            Hobby
          </NavLink>
        </nav>

        <div className="nav__right">
          {!loading && user ? (
            <button
              className="btn btn--ghost"
              onClick={() => navigate("/profile")}>
              {displayName}
            </button>
          ) : (
            <>
              <button
                className="btn btn--ghost"
                onClick={() => navigate("/login")}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
