import { useState } from "react";

function Sidebar({
                     contentType,
                     searchValue,
                     activeGenre,
                     genres,
                     onContentTypeChange,
                     onSearchChange,
                     onGenreChange,
                     onClearFilters,
                 }) {
    const [isTypeOpen, setIsTypeOpen] = useState(false);

    const typeOptions = [
        { value: "movies", label: "Filmy" },
        { value: "series", label: "Seriale" },
        { value: "all", label: "Wszystko" },
    ];

    const activeTypeLabel =
        typeOptions.find((option) => option.value === contentType)?.label || "Filmy";

    function handleTypeChange(value) {
        onContentTypeChange(value);
        setIsTypeOpen(false);
    }

    return (
        <aside className="sidebar glass-card">
            <div className="sidebar-heading">
                <h2>Baza tytułów</h2>
            </div>

            <div className="form-field">
                <span>Typ treści</span>

                <div className="custom-select">
                    <button
                        type="button"
                        className={isTypeOpen ? "custom-select-button open" : "custom-select-button"}
                        onClick={() => setIsTypeOpen((currentValue) => !currentValue)}
                    >
                        <span>{activeTypeLabel}</span>
                        <span className="material-symbols-outlined">expand_more</span>
                    </button>

                    {isTypeOpen && (
                        <div className="custom-select-menu">
                            {typeOptions.map((option) => (
                                <button
                                    type="button"
                                    key={option.value}
                                    className={
                                        option.value === contentType
                                            ? "custom-select-option active"
                                            : "custom-select-option"
                                    }
                                    onClick={() => handleTypeChange(option.value)}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <label className="form-field search-field">
                <span>Szukaj po tytule</span>
                <div className="input-with-icon">
                    <span className="material-symbols-outlined">search</span>
                    <input
                        type="text"
                        placeholder="Np. Miasto cieni"
                        value={searchValue}
                        onChange={(event) => onSearchChange(event.target.value)}
                    />
                </div>
            </label>

            <div className="genre-list">
                <h3>Gatunki</h3>
                <div className="genre-buttons">
                    {genres.map((genre) => (
                        <button
                            key={genre}
                            className={activeGenre === genre ? "genre-button active" : "genre-button"}
                            onClick={() => onGenreChange(genre)}
                        >
                            {genre}
                        </button>
                    ))}
                </div>
            </div>

            <button className="button-secondary full-width" onClick={onClearFilters}>
                Wyczyść filtry
            </button>
        </aside>
    );
}

export default Sidebar;