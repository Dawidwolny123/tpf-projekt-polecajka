import EmptyState from "../components/EmptyState";
import ProfileSection from "../components/ProfileSection";
import SummaryCard from "../components/SummaryCard";

function ProfileView({
  isLoggedIn,
  favorites,
  savedRecommendations,
  likedTitles,
  dislikedTitles,
  onOpenLogin,
  onNavigate,
}) {
  if (!isLoggedIn) {
    return (
      <section className="view">
        <EmptyState
          title="Profil wymaga logowania"
          description="Zaloguj się, aby zobaczyć ulubione tytuły, zapisane rekomendacje i historię ocen."
          actionLabel="Zaloguj się"
          onAction={onOpenLogin}
        />
      </section>
    );
  }

  return (
    <section className="view profile-view">
      <div className="view-header">
        <h1>Profil użytkownika</h1>
        <p className="muted">
          Tutaj znajdziesz swoje ulubione, zapisane rekomendacje i historię
          wyborów.
        </p>
      </div>

      <div className="profile-summary">
        <SummaryCard label="Ulubione" value={favorites.length} />
        <SummaryCard
          label="Zapisane rekomendacje"
          value={savedRecommendations.length}
        />
        <SummaryCard label="Polubione" value={likedTitles.length} />
        <SummaryCard label="Odrzucone" value={dislikedTitles.length} />
      </div>

      <ProfileSection
        title="Ulubione"
        items={favorites}
        emptyMessage="Nie masz jeszcze ulubionych tytułów. Przejdź do bazy i dodaj pierwszy tytuł."
        actionLabel="Przejdź do bazy"
        onAction={() => onNavigate("database")}
      />

      <ProfileSection
        title="Zapisane rekomendacje"
        items={savedRecommendations}
        emptyMessage="Nie masz jeszcze zapisanych rekomendacji. Oceń kilka tytułów i zapisz wynik."
        actionLabel="Przejdź do polecania"
        onAction={() => onNavigate("recommendation")}
      />

      <div className="profile-columns">
        <ProfileSection
          title="Polubione tytuły"
          items={likedTitles}
          emptyMessage="Nie polubiono jeszcze żadnego tytułu."
        />

        <ProfileSection
          title="Odrzucone tytuły"
          items={dislikedTitles}
          emptyMessage="Nie odrzucono jeszcze żadnego tytułu."
        />
      </div>
    </section>
  );
}

export default ProfileView;
