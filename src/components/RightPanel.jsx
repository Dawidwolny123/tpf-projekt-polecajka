import { getRightPanelContent } from "../utils/titleUtils";

function RightPanel({
  currentView,
  isLoggedIn,
  favoritesCount,
  savedCount,
  ratingCount,
  totalRequiredRatings,
}) {
  const content = getRightPanelContent(currentView);
  const remainingRatings = Math.max(totalRequiredRatings - ratingCount, 0);

  return (
    <aside className="right-panel">
      <h2>{content.title}</h2>
      <p>{content.description}</p>

      <div className="help-box">
        <h3>Wskazówka</h3>
        <p>{content.tip}</p>
      </div>

      <div className="stats-box">
        <h3>Statystyki</h3>
        <p>Status: {isLoggedIn ? "zalogowany" : "niezalogowany"}</p>
        <p>
          Oceny: {ratingCount} / {totalRequiredRatings}
        </p>
        <p>Pozostało do rekomendacji: {remainingRatings}</p>
        <p>Ulubione: {favoritesCount}</p>
        <p>Zapisane: {savedCount}</p>
      </div>
    </aside>
  );
}

export default RightPanel;
