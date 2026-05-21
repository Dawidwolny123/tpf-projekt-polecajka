import EmptyState from "../components/EmptyState";
import PosterPlaceholder from "../components/PosterPlaceholder";
import { getTypeLabel } from "../utils/titleUtils";

function ResultView({
                      recommendation,
                      similarTitles,
                      isSaved,
                      onShowDetails,
                      onDrawAgain,
                      onSaveRecommendation,
                      onResetRatings,
                    }) {
  if (!recommendation) {
    return (
        <section className="view">
          <EmptyState
              title="Brak rekomendacji"
              description="Oceń kilka tytułów, aby aplikacja mogła przygotować rekomendację."
              actionLabel="Wróć do polecania"
              onAction={onDrawAgain}
          />
        </section>
    );
  }

  return (
      <section className="view">
        <div className="view-header">
          <h1>Twoja rekomendacja</h1>
          <p className="muted">
            To propozycja na podstawie Twoich ostatnich ocen. Możesz ją zapisać po
            zalogowaniu.
          </p>
        </div>

        <article className="result-main">
          <PosterPlaceholder
              large
              title={recommendation.title}
              poster={recommendation.poster}
          />

          <div>
            <h2>{recommendation.polishTitle || recommendation.title}</h2>

            <div className="meta-row">
              <span className="tag">{getTypeLabel(recommendation.type)}</span>
              <span className="tag">{recommendation.genre}</span>
            </div>

            <p>{recommendation.description}</p>

            {isSaved && (
                <p className="success-text">Ta rekomendacja jest zapisana.</p>
            )}

            <div className="button-row">
              <button
                  className="button-secondary"
                  onClick={() => onShowDetails(recommendation)}
              >
                Szczegóły
              </button>
              <button onClick={onDrawAgain}>Losuj dalej</button>
              <button
                  className="button-primary"
                  onClick={() => onSaveRecommendation(recommendation)}
              >
                Zapisz rekomendację
              </button>
            </div>
          </div>
        </article>

        <h2>Podobne tytuły</h2>

        {similarTitles.length === 0 ? (
            <p className="muted">Brak podobnych tytułów do pokazania.</p>
        ) : (
            <div className="similar-list">
              {similarTitles.map((title) => (
                  <article key={title.id} className="small-card">
                    <h3>{title.polishTitle || title.title}</h3>
                    <p>{title.genre}</p>
                    <button
                        className="button-secondary"
                        onClick={() => onShowDetails(title)}
                    >
                      Szczegóły
                    </button>
                  </article>
              ))}
            </div>
        )}

        <div className="secondary-actions">
          <button className="button-danger" onClick={onResetRatings}>
            Wyczyść oceny i zacznij od nowa
          </button>
        </div>
      </section>
  );
}

export default ResultView;