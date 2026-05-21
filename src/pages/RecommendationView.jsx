import PosterPlaceholder from "../components/PosterPlaceholder";

function RecommendationView({
                              title,
                              ratingCount,
                              totalRequiredRatings,
                              onLike,
                              onDislike,
                              onUndoLastRating,
                              onResetRatings,
                              onShowDetails,
                            }) {
  const remainingRatings = Math.max(totalRequiredRatings - ratingCount, 0);

  if (!title) {
    return (
        <section className="view empty-state">
          <h1>Brak tytułów do polecania</h1>
          <p>Dodaj tytuły w panelu administratora albo zresetuj dane aplikacji.</p>
        </section>
    );
  }

  return (
      <section className="view recommendation-view">
        <div className="view-header centered">
          <h1>Tryb polecania</h1>
          <p className="muted">Oceń 10 tytułów, aby otrzymać rekomendację. Logowanie nie jest wymagane.</p>
        </div>

        <div className="progress-box">
          <strong>
            Oceniono: {ratingCount} / {totalRequiredRatings}
          </strong>
          <span>
          {remainingRatings > 0
              ? `Jeszcze ${remainingRatings} ocen do rekomendacji.`
              : "Rekomendacja jest gotowa."}
        </span>
        </div>

        <article className="recommendation-card">
          <PosterPlaceholder large title={title.title} poster={title.poster} />

          <div className="card-body">
            <h2>{title.polishTitle || title.title}</h2>

            <div className="meta-row">
              <span className="tag">{title.type === "movie" ? "Film" : "Serial"}</span>
              <span className="tag">{title.genre}</span>
            </div>

            <p>{title.description}</p>
          </div>

          <div className="card-actions">
            <button className="button-danger" onClick={onDislike}>
              Nie dla mnie
            </button>
            <button className="button-secondary" onClick={onShowDetails}>
              Szczegóły
            </button>
            <button className="button-primary" onClick={onLike}>
              Lubię to
            </button>
          </div>
        </article>

        <div className="secondary-actions">
          <button onClick={onUndoLastRating}>Cofnij ostatnią ocenę</button>
          <button onClick={onResetRatings}>Zresetuj oceny</button>
        </div>
      </section>
  );
}

export default RecommendationView;