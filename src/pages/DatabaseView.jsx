import EmptyState from "../components/EmptyState";
import PosterPlaceholder from "../components/PosterPlaceholder";
import { getContentTypeLabel, getTypeLabel } from "../utils/titleUtils";

function DatabaseView({
                          titles,
                          totalTitlesCount,
                          contentType,
                          searchValue,
                          activeGenre,
                          onShowDetails,
                          onClearFilters,
                      }) {
    return (
        <section className="view database-view">
            <div className="view-header">
                <p className="eyebrow">Katalog</p>
                <h1>Baza filmów i seriali</h1>
                <p className="muted">Kliknij kafelek albo przycisk „Szczegóły”, aby przejść do opisu tytułu.</p>
            </div>

            <div className="filter-summary">
                <span>Typ: {getContentTypeLabel(contentType)}</span>
                <span>Gatunek: {activeGenre}</span>
                <span>Szukaj: {searchValue.trim() || "brak"}</span>
            </div>

            {titles.length === 0 ? (
                <EmptyState
                    title="Nie znaleziono tytułów"
                    description={totalTitlesCount === 0 ? "Baza jest pusta. Dodaj tytuły w panelu administratora." : "Zmień typ treści, gatunek albo wyczyść wyszukiwanie."}
                    actionLabel="Wyczyść filtry"
                    onAction={onClearFilters}
                />
            ) : (
                <div className="titles-grid">
                    {titles.map((title) => (
                        <article key={title.id} className="title-tile" onClick={() => onShowDetails(title)}>
                            <div className="tile-poster-wrap">
                                <PosterPlaceholder title={title.title} poster={title.poster} />
                                <div className="tile-badges">
                                    <span>{getTypeLabel(title.type)}</span>
                                    <span>{title.genre}</span>
                                </div>
                            </div>

                            <div className="tile-content">
                                <h2>{title.polishTitle || title.title}</h2>
                                <p>{title.description}</p>
                            </div>

                            <button
                                className="button-outline full-width"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onShowDetails(title);
                                }}
                            >
                                Szczegóły
                            </button>
                        </article>
                    ))}
                </div>
            )}
        </section>
    );
}

export default DatabaseView;