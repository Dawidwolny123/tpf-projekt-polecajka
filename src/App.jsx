import { useMemo, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RightPanel from "./components/RightPanel";
import Footer from "./components/Footer";
import LoginModal from "./components/LoginModal";
import ConfirmModal from "./components/ConfirmModal";
import Toast from "./components/Toast";

import RecommendationView from "./views/RecommendationView";
import DatabaseView from "./views/DatabaseView";
import DetailsView from "./views/DetailsView";
import ResultView from "./views/ResultView";
import ProfileView from "./views/ProfileView";
import AdminView from "./views/AdminView";

import { genres } from "./data/genres";
import { initialMockTitles } from "./data/mockTitles";
import { addUniqueTitle } from "./utils/titleUtils";

function App() {
  const [currentView, setCurrentView] = useState("recommendation");
  const [previousView, setPreviousView] = useState("recommendation");

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

  const [selectedTitle, setSelectedTitle] = useState(null);
  const [ratingCount, setRatingCount] = useState(0);
  const [recommendationIndex, setRecommendationIndex] = useState(0);

  const [titles, setTitles] = useState(initialMockTitles);

  const [toastMessage, setToastMessage] = useState("");
  const [confirmModal, setConfirmModal] = useState(null);

  const totalRequiredRatings = 10;
  const currentRecommendation = titles[recommendationIndex % titles.length];

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

  function goToView(viewName) {
    if (viewName === "profile" && !isLoggedIn) {
      setPreviousView(currentView);
      setCurrentView("profile");
      showToast("Zaloguj się, aby zobaczyć profil.");
      return;
    }

    if (viewName === "admin" && !isLoggedIn) {
      setIsLoginModalOpen(true);
      showToast("Panel administratora wymaga logowania.");
      return;
    }

    setPreviousView(currentView);
    setCurrentView(viewName);
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

    setCurrentView("profile");
  }

  function handleLogout() {
    setIsLoggedIn(false);
    setCurrentView("recommendation");
    setPreviousView("recommendation");
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

    setRecommendationIndex((prev) => prev + 1);

    setRatingCount((prevCount) => {
      const nextCount = prevCount + 1;

      if (nextCount >= totalRequiredRatings) {
        setPreviousView("recommendation");
        setCurrentView("result");
        showToast("Gotowe. Przygotowaliśmy rekomendację.");
      }

      return nextCount;
    });
  }

  function handleUndoLastRating() {
    const lastLiked = likedTitles[likedTitles.length - 1];
    const lastDisliked = dislikedTitles[dislikedTitles.length - 1];

    if (!lastLiked && !lastDisliked) {
      showToast("Nie ma jeszcze czego cofnąć.");
      return;
    }

    if (lastLiked && (!lastDisliked || lastLiked.id > lastDisliked.id)) {
      setLikedTitles((prev) => prev.slice(0, -1));
    } else {
      setDislikedTitles((prev) => prev.slice(0, -1));
    }

    setRatingCount((prev) => Math.max(prev - 1, 0));
    setRecommendationIndex((prev) => Math.max(prev - 1, 0));
    showToast("Cofnięto ostatnią ocenę.");
  }

  function handleResetRatings() {
    setLikedTitles([]);
    setDislikedTitles([]);
    setRatingCount(0);
    setRecommendationIndex(0);
    setCurrentView("recommendation");
    showToast("Wyczyszczono historię ocen.");
  }

  function handleShowDetails(title) {
    setPreviousView(currentView);
    setSelectedTitle(title);
    setCurrentView("details");
  }

  function handleBackFromDetails() {
    setCurrentView(previousView || "recommendation");
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
    setRecommendationIndex((prev) => prev + 1);
    setCurrentView("recommendation");
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

        if (selectedTitle?.id === title.id) {
          setSelectedTitle(null);
        }

        setConfirmModal(null);
        showToast(`Usunięto: ${title.title}.`);
      },
    });
  }

  function handleClearFilters() {
    setContentType("all");
    setSearchValue("");
    setActiveGenre("Wszystkie");
    showToast("Wyczyszczono filtry.");
  }

  function renderCurrentView() {
    switch (currentView) {
      case "database":
        return (
          <DatabaseView
            titles={filteredTitles}
            totalTitlesCount={titles.length}
            contentType={contentType}
            searchValue={searchValue}
            activeGenre={activeGenre}
            onShowDetails={handleShowDetails}
            onClearFilters={handleClearFilters}
          />
        );

      case "details":
        return (
          <DetailsView
            title={selectedTitle}
            isFavorite={favorites.some((item) => item.id === selectedTitle?.id)}
            wasLiked={likedTitles.some((item) => item.id === selectedTitle?.id)}
            wasDisliked={dislikedTitles.some(
              (item) => item.id === selectedTitle?.id,
            )}
            onAddToFavorites={handleAddToFavorites}
            onBack={handleBackFromDetails}
            onBackToDatabase={() => setCurrentView("database")}
            onBackToRecommendation={() => setCurrentView("recommendation")}
          />
        );

      case "result":
        return (
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
        );

      case "profile":
        return (
          <ProfileView
            isLoggedIn={isLoggedIn}
            favorites={favorites}
            savedRecommendations={savedRecommendations}
            likedTitles={likedTitles}
            dislikedTitles={dislikedTitles}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onNavigate={goToView}
          />
        );

      case "admin":
        return (
          <AdminView
            titles={titles}
            onDeleteTitle={askDeleteTitle}
            onShowDetails={handleShowDetails}
            onMockSave={() =>
              showToast("Formularz jest mockowy. Dane nie zostały zapisane.")
            }
          />
        );

      case "home":
      case "recommendation":
      default:
        return (
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
        );
    }
  }

  return (
    <div className={isDarkMode ? "app dark" : "app light"}>
      <Header
        currentView={currentView}
        isLoggedIn={isLoggedIn}
        isDarkMode={isDarkMode}
        onNavigate={goToView}
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

        <main className="main-content">{renderCurrentView()}</main>

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

export default App;
