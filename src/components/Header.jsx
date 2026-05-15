import { NavLink } from "react-router-dom";

function Header({
  isLoggedIn,
  isDarkMode,
  onOpenLogin,
  onLogout,
  onToggleTheme,
}) {
  return (
    <header className="header">
      <div className="header-logo">Polecajka Filmów</div>

      <nav className="header-nav" aria-label="Główna nawigacja">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button"
          }
        >
          Polecanie
        </NavLink>

        <NavLink
          to="/database"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button"
          }
        >
          Baza
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            isActive ? "nav-button active" : "nav-button"
          }
        >
          Profil
        </NavLink>

        {isLoggedIn && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "nav-button active" : "nav-button"
            }
          >
            Admin
          </NavLink>
        )}
      </nav>

      <div className="header-actions">
        <button onClick={onToggleTheme}>
          {isDarkMode ? "Tryb jasny" : "Tryb ciemny"}
        </button>

        {isLoggedIn ? (
          <button className="button-secondary" onClick={onLogout}>
            Wyloguj
          </button>
        ) : (
          <button className="button-primary" onClick={onOpenLogin}>
            Zaloguj się
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
