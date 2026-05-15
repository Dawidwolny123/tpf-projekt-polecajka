import { getTypeLabel } from "../utils/titleUtils";

function ProfileSection({ title, items, emptyMessage, actionLabel, onAction }) {
  return (
    <section className="profile-section">
      <h2>{title}</h2>

      {items.length === 0 ? (
        <div>
          <p className="muted">{emptyMessage}</p>
          {actionLabel && onAction && (
            <button className="button-secondary" onClick={onAction}>
              {actionLabel}
            </button>
          )}
        </div>
      ) : (
        <ul className="clean-list">
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.title}</strong>
              <span>
                {getTypeLabel(item.type)} · {item.genre}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ProfileSection;
