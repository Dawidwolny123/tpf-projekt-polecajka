import { NavLink } from "react-router-dom";

function Header({
                    isLoggedIn,
                    onOpenLogin,
                    onLogout,
                }) {
    return (
        <header className="header">
            <div className="header-brand">
                <NavLink to="/" className="header-logo">
                    Polecajka Filmów
                </NavLink>
            </div>

            <nav className="header-nav" aria-label="Główna nawigacja">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}>
                    <span className="material-symbols-outlined">movie_filter</span>
                    Polecanie
                </NavLink>

                <NavLink to="/database" className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}>
                    <span className="material-symbols-outlined">database</span>
                    Baza
                </NavLink>

                <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}>
                    <span className="material-symbols-outlined">person</span>
                    Profil
                </NavLink>

                {isLoggedIn && (
                    <NavLink to="/admin" className={({ isActive }) => isActive ? "nav-button active" : "nav-button"}>
                        <span className="material-symbols-outlined">admin_panel_settings</span>
                        Admin
                    </NavLink>
                )}
            </nav>

            <div className="header-actions">
                {isLoggedIn ? (
                    <button className="button-secondary" onClick={onLogout}>
                        Wyloguj
                    </button>
                ) : (
                    <button className="button-primary" onClick={onOpenLogin}>
                        Zaloguj się
                    </button>
                )}

                <div className="avatar" aria-hidden="true">
                    PF
                </div>
            </div>
        </header>
    );
}

export default Header;