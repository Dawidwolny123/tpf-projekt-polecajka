import { useEffect, useMemo, useRef, useState } from "react";
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
    const rowsPerPage = 3;
    const gridRef = useRef(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [columnsCount, setColumnsCount] = useState(1);

    const titlesPerPage = Math.max(columnsCount * rowsPerPage, 1);
    const totalPages = Math.max(Math.ceil(titles.length / titlesPerPage), 1);
    const safeCurrentPage = Math.min(currentPage, totalPages);

    const visibleTitles = useMemo(() => {
        const startIndex = (safeCurrentPage - 1) * titlesPerPage;
        const endIndex = startIndex + titlesPerPage;

        return titles.slice(startIndex, endIndex);
    }, [titles, safeCurrentPage, titlesPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [contentType, searchValue, activeGenre]);

    useEffect(() => {
        function updateColumnsCount() {
            if (!gridRef.current) {
                return;
            }

            const gridStyles = window.getComputedStyle(gridRef.current);
            const gridColumns = gridStyles.getPropertyValue("grid-template-columns");
            const nextColumnsCount = gridColumns
                .split(" ")
                .filter((column) => column.trim().length > 0).length;

            setColumnsCount(Math.max(nextColumnsCount, 1));
        }

        updateColumnsCount();

        const resizeObserver = new ResizeObserver(updateColumnsCount);

        if (gridRef.current) {
            resizeObserver.observe(gridRef.current);
        }

        window.addEventListener("resize", updateColumnsCount);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateColumnsCount);
        };
    }, []);

    function goToPreviousPage() {
        setCurrentPage((page) => Math.max(page - 1, 1));
    }

    function goToNextPage() {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    }

    return (
        <section className="view database-view">
            <div className="filter-summary">
                <span>Typ: {getContentTypeLabel(contentType)}</span>
                <span>Gatunek: {activeGenre}</span>
                <span>Szukaj: {searchValue.trim() || "brak"}</span>
            </div>

            {titles.length === 0 ? (
                <EmptyState
                    title="Nie znaleziono tytułów"
                    description={
                        totalTitlesCount === 0
                            ? "Baza jest pusta. Dodaj tytuły w panelu administratora."
                            : "Zmień typ treści, gatunek albo wyczyść wyszukiwanie."
                    }
                    actionLabel="Wyczyść filtry"
                    onAction={onClearFilters}
                />
            ) : (
                <>
                    <div className="titles-grid" ref={gridRef}>
                        {visibleTitles.map((title) => (
                            <article
                                key={title.id}
                                className="title-tile"
                                onClick={() => onShowDetails(title)}
                            >
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

                    {totalPages > 1 && (
                        <div className="database-pagination">
                            <button
                                className="button-secondary"
                                onClick={goToPreviousPage}
                                disabled={safeCurrentPage === 1}
                            >
                                Poprzednia
                            </button>

                            <span>
                Strona {safeCurrentPage} z {totalPages}
              </span>

                            <button
                                className="button-secondary"
                                onClick={goToNextPage}
                                disabled={safeCurrentPage === totalPages}
                            >
                                Następna
                            </button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
}

export default DatabaseView;