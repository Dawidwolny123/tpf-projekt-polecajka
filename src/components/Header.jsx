function Header({
  currentView,
  isLoggedIn,
  isDarkMode,
  onNavigate,
  onOpenLogin,
  onLogout,
  onToggleTheme,
}) {
  return (
    <header className="header">
      <div className="header-logo">Polecajka Filmów</div>

      <nav className="header-nav" aria-label="Główna nawigacja">
        <button
          className={currentView === "recommendation" ? "active" : ""}
          onClick={() => onNavigate("recommendation")}
        >
          Polecanie
        </button>

        <button
          className={currentView === "database" ? "active" : ""}
          onClick={() => onNavigate("database")}
        >
          Baza
        </button>

        <button
          className={currentView === "profile" ? "active" : ""}
          onClick={() => onNavigate("profile")}
        >
          Profil
        </button>

        <button
          className={currentView === "admin" ? "active" : ""}
          onClick={() => onNavigate("admin")}
        >
          Admin
        </button>
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
