import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `nav__link ${isActive ? "nav__link--active" : ""}`;

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
            스터디
          </NavLink>
          <NavLink to="/project" className={linkClass}>
            프로젝트
          </NavLink>
          <NavLink to="/sports" className={linkClass}>
            스포츠
          </NavLink>
          <NavLink to="/hobby" className={linkClass}>
            취미
          </NavLink>
        </nav>

        <div className="nav__right">
          <button className="btn btn--ghost">Login</button>
        </div>
      </div>
    </header>
  );
}
