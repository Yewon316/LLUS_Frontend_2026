import { NavLink } from "react-router-dom";
import logo from './image/moim_logo.png';
import '../styles/home.css';


export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `nav__link ${isActive ? "nav__link--active" : "nav__link"}`;

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
          <button className="btn btn--ghost">Login</button>
        </div>
      </div>
    </header>
  );
}
