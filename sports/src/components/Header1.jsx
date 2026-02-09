import "./Header.css";
import logo from "./purdue logo.png";

export function Header(){
    const sportsCategories = [ "football", "soccer", "basketball", "gym", "running", "etc"];
    return(
        <div className = "header-wrapper">
            <img src = {logo} alt = "Purdue Logo" classname = "header-logo" />

            
            <hr/>
            <nav className="button-container">
                <button className = "headerButton">Main</button>
                <button className = "headerButton">Study</button>
                <button className = "headerButton">Sports</button>
                <button className = "headerButton">Etc</button>
                
            </nav>
            <hr/>
            <h1 className = "top"> Welcome to Sports section</h1>
            <button className = "create-button">Create new event</button>
            <nav className = "sports-navbar">
                <div className = "nav-links">
                    {sportsCategories.map((sport)=>(
                        <button key = {sport} className = "sport-link">
                            {sport}
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    )
}