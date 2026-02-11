import { NavLink } from "react-router-dom";


export default function Header(){
    const linkClass = ({ isActive }) =>
         (isActive ? "nav-link nav-link-active" : "nav-link");

    return(
        <header className="header">
            <div className="container header-inner">

                <div className="header-left">
                    <span className="logo">Logo</span>
                </div>

                <nav className="header-center">
                    <NavLink to="/study" className={linkClass}>공부</NavLink>
                    <NavLink to="/exercise" className={linkClass}>운동</NavLink>
                    <NavLink to="/hobby" className={linkClass}>취미</NavLink>
                  
                </nav>

                <div className="header-right">
                    <button className="login-btn">Login</button>
                </div>
            </div>
        </header>
    );
}

