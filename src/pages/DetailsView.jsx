import EmptyState from "../components/EmptyState";
import PosterPlaceholder from "../components/PosterPlaceholder";
import TitleMetaGrid from "../components/TitleMetaGrid";
import { getTypeLabel } from "../utils/titleUtils";

function DetailsView({
                         title,
                         isFavorite,
                         wasLiked,
                         wasDisliked,
                         onAddToFavorites,
                         onBack,
                         onBackToDatabase,
                         onBackToRecommendation,
                     }) {
    if (!title) {
        return (
            <section className="view">
                <EmptyState
                    title="Brak wybranego tytułu"
                    description="Wróć do bazy albo polecania i wybierz film lub serial."
                    actionLabel="Wróć do bazy"
                    onAction={onBackToDatabase}
                />
            </section>
        );
    }

    const filteredTags = title.tags?.filter((tag) => tag !== title.genre) || [];

    return (
        <section className="view details-view">
            <div className="details-poster">
                <PosterPlaceholder large title={title.title} poster={title.poster} />
            </div>

            <div className="details-content">
                <button className="button-secondary" onClick={onBack}>
                    Wróć
                </button>

                <div className="details-heading">
                    <span className="details-type">{getTypeLabel(title.type)}</span>
                    <h1>{title.polishTitle || title.title}</h1>
                    {title.polishTitle && <p className="details-original-title">{title.title}</p>}
                </div>

                <TitleMetaGrid title={title} />

                <div className="meta-row">
                    <span className="tag">{getTypeLabel(title.type)}</span>
                    <span className="tag">{title.genre}</span>
                    {filteredTags.map((tag) => (
                        <span className="tag" key={tag}>
              {tag}
            </span>
                    ))}
                </div>

                <div className="details-description">
                    <h2>Opis</h2>
                    <p>{title.description}</p>
                </div>

                <div className="status-list">
                    {isFavorite && <span>Już w ulubionych</span>}
                    {wasLiked && <span>Polubiony wcześniej</span>}
                    {wasDisliked && <span>Odrzucony wcześniej</span>}
                    {!isFavorite && !wasLiked && !wasDisliked && <span>Nie oceniono jeszcze tego tytułu</span>}
                </div>

                <div className="button-row">
                    <button className="button-primary" onClick={() => onAddToFavorites(title)}>
                        Dodaj do ulubionych
                    </button>
                    <button className="button-secondary" onClick={onBackToDatabase}>
                        Powrót do bazy
                    </button>
                    <button className="button-secondary" onClick={onBackToRecommendation}>
                        Powrót do polecania
                    </button>
                </div>
            </div>
        </section>
    );
}

export default DetailsView;