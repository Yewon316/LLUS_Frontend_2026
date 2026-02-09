import "./Header.css";

export function Header(){
    return(
        <div>
            <h1 className = "top"> Welcome to Sports section</h1>
            <hr/>
            <nav className="button-container">
                <button className = "headerButton">Main</button>
                <button className = "headerButton">Study</button>
                <button className = "headerButton">Sports</button>
                <button className = "headerButton">Etc</button>
                <button className = "create-button">Create new event</button>
            </nav>
            <hr/>
        </div>
    )
}