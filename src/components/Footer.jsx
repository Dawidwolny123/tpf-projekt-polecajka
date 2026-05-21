import { NavLink } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer">
            <nav className="bottom-nav" aria-label="Dolna nawigacja">
                <NavLink to="/" className={({ isActive }) => isActive ? "bottom-nav-link active" : "bottom-nav-link"}>
                    <span className="material-symbols-outlined">movie_filter</span>
                    <span>Polecanie</span>
                </NavLink>
                <NavLink to="/database" className={({ isActive }) => isActive ? "bottom-nav-link active" : "bottom-nav-link"}>
                    <span className="material-symbols-outlined">database</span>
                    <span>Baza</span>
                </NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "bottom-nav-link active" : "bottom-nav-link"}>
                    <span className="material-symbols-outlined">person</span>
                    <span>Profil</span>
                </NavLink>
            </nav>
        </footer>
    );
}

export default Footer;