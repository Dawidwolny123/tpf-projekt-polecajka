import { useMemo, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";
import EmptyState from "./components/EmptyState";

import RecommendationView from "./pages/RecommendationView";
import DatabaseView from "./pages/DatabaseView";
import DetailsView from "./pages/DetailsView";
import ResultView from "./pages/ResultView";
import ProfileView from "./pages/ProfileView";
import AdminView from "./pages/AdminView";

import { genres } from "./data/genres";
import { initialMockTitles } from "./data/mockTitles";
import { addUniqueTitle } from "./utils/titleUtils";

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [contentType, setContentType] = useState("movies");
  const [searchValue, setSearchValue] = useState("");
  const [activeGenre, setActiveGenre] = useState("Wszystkie");

  const [likedTitles, setLikedTitles] = useState([]);
  const [dislikedTitles, setDislikedTitles] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [savedRecommendations, setSavedRecommendations] = useState([]);

  const [ratingHistory, setRatingHistory] = useState([]);

  const [ratingCount, setRatingCount] = useState(0);
  const [recommendationIndex, setRecommendationIndex] = useState(0);

  const [titles, setTitles] = useState(initialMockTitles);

  const [toastMessage, setToastMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);

  const totalRequiredRatings = 10;
  const currentRecommendation = titles[recommendationIndex % titles.length];

  const currentView = getCurrentViewFromPath(location.pathname);

  const filteredTitles = useMemo(() => {
    return titles.filter((title) => {
      const matchesType =
        contentType === "all" ||
        (contentType === "movies" && title.type === "movie") ||
        (contentType === "series" && title.type === "series");

      const matchesSearch = title.title
        .toLowerCase()
        .includes(searchValue.toLowerCase().trim());

      const matchesGenre =
        activeGenre === "Wszystkie" || title.genre === activeGenre;

      return matchesType && matchesSearch && matchesGenre;
    });
  }, [titles, contentType, searchValue, activeGenre]);

  const mainRecommendation = likedTitles[0] || titles[0];

  const similarTitles = titles
    .filter((title) => title.id !== mainRecommendation?.id)
    .slice(0, 3);

  function showToast(message) {
    setToastMessage(message);

    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  }

  function handleLogin() {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
    showToast("Zalogowano pomyślnie.");

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
      return;
    }

    navigate("/profile");
  }

  function handleLogout() {
    setIsLoggedIn(false);
    navigate("/");
    showToast("Wylogowano.");
  }

  function requireLogin(action, message) {
    if (!isLoggedIn) {
      setPendingAction(() => action);
      setIsLoginModalOpen(true);
      showToast(message);
      return false;
    }

    return true;
  }

  function handleRateTitle(type) {
    if (!currentRecommendation) return;

    if (type === "like") {
      setLikedTitles((prev) => addUniqueTitle(prev, currentRecommendation));
      showToast(`Polubiono: ${currentRecommendation.title}.`);
    } else {
      setDislikedTitles((prev) => addUniqueTitle(prev, currentRecommendation));
      showToast(`Odrzucono: ${currentRecommendation.title}.`);
    }

    setRatingHistory((prev) => [
      ...prev,
      {
        title: currentRecommendation,
        type,
      },
    ]);

    setRecommendationIndex((prev) => prev + 1);

    setRatingCount((prevCount) => {
      const nextCount = prevCount + 1;

      if (nextCount >= totalRequiredRatings) {
        navigate("/result");
        showToast("Gotowe. Przygotowaliśmy rekomendację.");
      }

      return nextCount;
    });
  }

  function handleUndoLastRating() {
    if (ratingHistory.length === 0) {
      showToast("Nie ma jeszcze czego cofnąć.");
      return;
    }

    const lastRating = ratingHistory[ratingHistory.length - 1];

    if (lastRating.type === "like") {
      setLikedTitles((prev) =>
        prev.filter((title) => title.id !== lastRating.title.id),
      );
    } else {
      setDislikedTitles((prev) =>
        prev.filter((title) => title.id !== lastRating.title.id),
      );
    }

    setRatingHistory((prev) => prev.slice(0, -1));
    setRatingCount((prev) => Math.max(prev - 1, 0));
    setRecommendationIndex((prev) => Math.max(prev - 1, 0));

    showToast("Cofnięto ostatnią ocenę.");
  }

  function handleResetRatings() {
    setLikedTitles([]);
    setDislikedTitles([]);
    setRatingHistory([]);
    setRatingCount(0);
    setRecommendationIndex(0);
    navigate("/");
    showToast("Wyczyszczono historię ocen.");
  }

  function handleShowDetails(title) {
    navigate(`/details/${title.id}`, {
      state: {
        from: location.pathname,
      },
    });
  }

  function handleBackFromDetails() {
    const previousPath = location.state?.from || "/database";
    navigate(previousPath);
  }

  function handleAddToFavorites(title) {
    const action = () => {
      setFavorites((prev) => {
        const exists = prev.some((item) => item.id === title.id);

        if (exists) {
          showToast("Ten tytuł jest już w ulubionych.");
          return prev;
        }

        showToast(`Dodano do ulubionych: ${title.title}.`);
        return [...prev, title];
      });
    };

    if (!requireLogin(action, "Zaloguj się, aby dodać tytuł do ulubionych.")) {
      return;
    }

    action();
  }

  function handleSaveRecommendation(title) {
    const action = () => {
      setSavedRecommendations((prev) => {
        const exists = prev.some((item) => item.id === title.id);

        if (exists) {
          showToast("Ta rekomendacja jest już zapisana.");
          return prev;
        }

        showToast(`Zapisano rekomendację: ${title.title}.`);
        return [...prev, title];
      });
    };

    if (!requireLogin(action, "Zaloguj się, aby zapisać rekomendację.")) {
      return;
    }

    action();
  }

  function handleDrawAgain() {
    setRatingCount(0);
    setRatingHistory([]);
    setRecommendationIndex((prev) => prev + 1);
    navigate("/");
    showToast("Losujemy kolejne propozycje.");
  }

  function askDeleteTitle(title) {
    setConfirmModal({
      title: "Usuń tytuł",
      message: `Czy na pewno chcesz usunąć „${title.title}”? Tej akcji nie można cofnąć.`,
      confirmLabel: "Usuń",
      cancelLabel: "Anuluj",
      onConfirm: () => {
        setTitles((prev) => prev.filter((item) => item.id !== title.id));
        setConfirmModal(null);
        showToast(`Usunięto: ${title.title}.`);

        if (location.pathname === `/details/${title.id}`) {
          navigate("/database");
        }
      },
    });
  }

  function handleClearFilters() {
    setContentType("all");
    setSearchValue("");
    setActiveGenre("Wszystkie");
    showToast("Wyczyszczono filtry.");
  }

  return (
    <div className={isDarkMode ? "app dark" : "app light"}>
      <Header
        isLoggedIn={isLoggedIn}
        isDarkMode={isDarkMode}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={handleLogout}
        onToggleTheme={() => setIsDarkMode((prev) => !prev)}
      />

      <div className="app-layout">
        <Sidebar
          contentType={contentType}
          searchValue={searchValue}
          activeGenre={activeGenre}
          genres={genres}
          onContentTypeChange={setContentType}
          onSearchChange={setSearchValue}
          onGenreChange={setActiveGenre}
          onClearFilters={handleClearFilters}
        />

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <RecommendationView
                  title={currentRecommendation}
                  ratingCount={ratingCount}
                  totalRequiredRatings={totalRequiredRatings}
                  onLike={() => handleRateTitle("like")}
                  onDislike={() => handleRateTitle("dislike")}
                  onUndoLastRating={handleUndoLastRating}
                  onResetRatings={handleResetRatings}
                  onShowDetails={() => handleShowDetails(currentRecommendation)}
                />
              }
            />

            <Route
              path="/database"
              element={
                <DatabaseView
                  titles={filteredTitles}
                  totalTitlesCount={titles.length}
                  contentType={contentType}
                  searchValue={searchValue}
                  activeGenre={activeGenre}
                  onShowDetails={handleShowDetails}
                  onClearFilters={handleClearFilters}
                />
              }
            />

            <Route
              path="/details/:id"
              element={
                <DetailsRoute
                  titles={titles}
                  favorites={favorites}
                  likedTitles={likedTitles}
                  dislikedTitles={dislikedTitles}
                  onAddToFavorites={handleAddToFavorites}
                  onBack={handleBackFromDetails}
                  onBackToDatabase={() => navigate("/database")}
                  onBackToRecommendation={() => navigate("/")}
                />
              }
            />

            <Route
              path="/result"
              element={
                <ResultView
                  recommendation={mainRecommendation}
                  similarTitles={similarTitles}
                  isSaved={savedRecommendations.some(
                    (item) => item.id === mainRecommendation?.id,
                  )}
                  onShowDetails={handleShowDetails}
                  onDrawAgain={handleDrawAgain}
                  onSaveRecommendation={handleSaveRecommendation}
                  onResetRatings={handleResetRatings}
                />
              }
            />

            <Route
              path="/profile"
              element={
                <ProfileView
                  isLoggedIn={isLoggedIn}
                  favorites={favorites}
                  savedRecommendations={savedRecommendations}
                  likedTitles={likedTitles}
                  dislikedTitles={dislikedTitles}
                  onOpenLogin={() => setIsLoginModalOpen(true)}
                  onNavigate={navigate}
                />
              }
            />

            <Route
              path="/admin"
              element={
                isLoggedIn ? (
                  <AdminView
                    titles={titles}
                    onDeleteTitle={askDeleteTitle}
                    onShowDetails={handleShowDetails}
                    onMockSave={() =>
                      showToast(
                        "Formularz jest mockowy. Dane nie zostały zapisane.",
                      )
                    }
                  />
                ) : (
                  <Navigate to="/profile" replace />
                )
              }
            />

            <Route
              path="*"
              element={
                <EmptyState
                  title="Nie znaleziono strony"
                  description="Taki adres nie istnieje w aplikacji."
                  actionLabel="Wróć do polecania"
                  onAction={() => navigate("/")}
                />
              }
            />
          </Routes>
        </main>

        <RightPanel
          currentView={currentView}
          isLoggedIn={isLoggedIn}
          favoritesCount={favorites.length}
          savedCount={savedRecommendations.length}
          ratingCount={ratingCount}
          totalRequiredRatings={totalRequiredRatings}
        />
      </div>

      <Footer />

      {toastMessage && <Toast message={toastMessage} />}

      {isLoginModalOpen && (
        <LoginModal
          onClose={() => {
            setIsLoginModalOpen(false);
            setPendingAction(null);
          }}
          onLogin={handleLogin}
        />
      )}

      {confirmModal && (
        <ConfirmModal
          title={confirmModal.title}
          message={confirmModal.message}
          confirmLabel={confirmModal.confirmLabel}
          cancelLabel={confirmModal.cancelLabel}
          onConfirm={confirmModal.onConfirm}
          onCancel={() => setConfirmModal(null)}
        />
      )}
    </div>
  );
}

function DetailsRoute({
  titles,
  favorites,
  likedTitles,
  dislikedTitles,
  onAddToFavorites,
  onBack,
  onBackToDatabase,
  onBackToRecommendation,
}) {
  const { id } = useParams();
  const title = titles.find((item) => item.id === Number(id));

  return (
    <DetailsView
      title={title}
      isFavorite={favorites.some((item) => item.id === title?.id)}
      wasLiked={likedTitles.some((item) => item.id === title?.id)}
      wasDisliked={dislikedTitles.some((item) => item.id === title?.id)}
      onAddToFavorites={onAddToFavorites}
      onBack={onBack}
      onBackToDatabase={onBackToDatabase}
      onBackToRecommendation={onBackToRecommendation}
    />
  );
}

function getCurrentViewFromPath(pathname) {
  if (pathname.startsWith("/database")) return "database";
  if (pathname.startsWith("/details")) return "details";
  if (pathname.startsWith("/result")) return "result";
  if (pathname.startsWith("/profile")) return "profile";
  if (pathname.startsWith("/admin")) return "admin";
  return "recommendation";
}

export default App;
