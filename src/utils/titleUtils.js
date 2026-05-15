export function addUniqueTitle(list, title) {
  const exists = list.some((item) => item.id === title.id);

  if (exists) {
    return list;
  }

  return [...list, title];
}

export function getTypeLabel(type) {
  return type === "movie" ? "Film" : "Serial";
}

export function getContentTypeLabel(contentType) {
  if (contentType === "movies") return "Filmy";
  if (contentType === "series") return "Seriale";
  return "Wszystko";
}

export function getRightPanelContent(currentView) {
  switch (currentView) {
    case "database":
      return {
        title: "Baza tytułów",
        description: "Przeglądaj katalog filmów i seriali.",
        tip: "Użyj filtrów po lewej stronie albo kliknij kafelek, aby zobaczyć szczegóły.",
      };

    case "details":
      return {
        title: "Szczegóły",
        description: "Tutaj widzisz pełniejszy opis wybranego tytułu.",
        tip: "Dodanie do ulubionych wymaga logowania, ale samo przeglądanie działa bez konta.",
      };

    case "result":
      return {
        title: "Wynik",
        description: "To rekomendacja przygotowana po kilku ocenach.",
        tip: "Możesz zapisać rekomendację po zalogowaniu albo wylosować kolejną.",
      };

    case "profile":
      return {
        title: "Profil",
        description: "Tutaj znajdziesz ulubione, zapisane i historię ocen.",
        tip: "Jeżeli lista jest pusta, wróć do polecania albo bazy i wykonaj kilka akcji.",
      };

    case "admin":
      return {
        title: "Admin",
        description: "Panel do zarządzania tytułami.",
        tip: "Usuwanie wymaga potwierdzenia, aby uniknąć przypadkowych błędów.",
      };

    case "recommendation":
    default:
      return {
        title: "Jak działa polecanie?",
        description: "Oceń kilka kart, aby dostać rekomendację.",
        tip: "Nie musisz się logować, aby oceniać. Logowanie jest potrzebne dopiero do zapisywania.",
      };
  }
}
