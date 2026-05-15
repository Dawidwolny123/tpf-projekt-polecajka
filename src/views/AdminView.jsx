import { useState } from "react";
import EmptyState from "../components/EmptyState";
import { getTypeLabel } from "../utils/titleUtils";

function AdminView({ titles, onDeleteTitle, onShowDetails, onMockSave }) {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editedTitle, setEditedTitle] = useState(null);

  function handleAddClick() {
    setEditedTitle(null);
    setIsFormVisible(true);
  }

  function handleEditClick(title) {
    setEditedTitle(title);
    setIsFormVisible(true);
  }

  return (
    <section className="view">
      <div className="view-header">
        <h1>Panel administratora</h1>
        <p className="muted">
          To prosty panel mockowy. Usuwanie działa lokalnie, a formularz jest
          przygotowany do dalszej rozbudowy.
        </p>
      </div>

      <div className="admin-actions">
        <button className="button-primary" onClick={handleAddClick}>
          Dodaj tytuł
        </button>
        <button
          className="button-secondary"
          onClick={() => alert("Tutaj można później dodać zarządzanie tagami.")}
        >
          Zarządzaj tagami
        </button>
      </div>

      {isFormVisible && (
        <div className="admin-form">
          <h2>{editedTitle ? "Edycja tytułu" : "Dodawanie tytułu"}</h2>

          <label className="form-field">
            Tytuł
            <input defaultValue={editedTitle?.title || ""} />
          </label>

          <label className="form-field">
            Typ
            <select defaultValue={editedTitle?.type || "movie"}>
              <option value="movie">Film</option>
              <option value="series">Serial</option>
            </select>
          </label>

          <label className="form-field">
            Gatunek
            <input defaultValue={editedTitle?.genre || ""} />
          </label>

          <label className="form-field">
            Opis
            <textarea defaultValue={editedTitle?.description || ""} />
          </label>

          <div className="button-row">
            <button className="button-primary" onClick={onMockSave}>
              Zapisz
            </button>
            <button
              className="button-secondary"
              onClick={() => setIsFormVisible(false)}
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {titles.length === 0 ? (
        <EmptyState
          title="Brak tytułów w bazie"
          description="Dodaj pierwszy tytuł, aby baza nie była pusta."
          actionLabel="Dodaj tytuł"
          onAction={handleAddClick}
        />
      ) : (
        <div className="admin-list">
          {titles.map((title) => (
            <div key={title.id} className="admin-row">
              <div>
                <strong>{title.title}</strong>
                <p>
                  {getTypeLabel(title.type)} · {title.genre}
                </p>
              </div>

              <div className="admin-row-actions">
                <button
                  className="button-secondary"
                  onClick={() => onShowDetails(title)}
                >
                  Podgląd
                </button>
                <button
                  className="button-secondary"
                  onClick={() => handleEditClick(title)}
                >
                  Edytuj
                </button>
                <button
                  className="button-danger"
                  onClick={() => onDeleteTitle(title)}
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default AdminView;
