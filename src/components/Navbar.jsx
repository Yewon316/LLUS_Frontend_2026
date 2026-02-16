import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `nav__link ${isActive ? "nav__link--active" : "nav__link"}`;

  return (
    <header className="nav">
      <div className="nav__inner">
        <div className="nav__left">
          <NavLink to="/" className={linkClass}>
            Logo
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
          <button className="btn btn--ghost">Login</button>
        </div>
      </div>
    </header>
  );
}
