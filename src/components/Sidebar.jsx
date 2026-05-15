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
  return (
    <aside className="sidebar">
      <h2>Baza tytułów</h2>

      <label className="form-field">
        Typ treści
        <select
          value={contentType}
          onChange={(event) => onContentTypeChange(event.target.value)}
        >
          <option value="movies">Filmy</option>
          <option value="series">Seriale</option>
          <option value="all">Wszystko</option>
        </select>
      </label>

      <label className="form-field">
        Szukaj po tytule
        <input
          type="text"
          placeholder="Np. Miasto cieni"
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>

      <div className="genre-list">
        <h3>Gatunki</h3>

        {genres.map((genre) => (
          <button
            key={genre}
            className={
              activeGenre === genre ? "genre-button active" : "genre-button"
            }
            onClick={() => onGenreChange(genre)}
          >
            {genre}
          </button>
        ))}
      </div>

      <button className="button-secondary full-width" onClick={onClearFilters}>
        Wyczyść filtry
      </button>
    </aside>
  );
}

export default Sidebar;
