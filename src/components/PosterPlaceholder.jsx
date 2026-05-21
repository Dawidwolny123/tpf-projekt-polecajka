const posterMap = {
    "21 jump street": "21_jump_street.jpg",
    "a quiet place": "a_quite_place.jpg",
    "dr strangelove": "drstrangelove.jpg",
    "dr. strangelove": "drstrangelove.jpg",
    "forrest gump": "forrest_gump.jpg",
    "free solo": "free_solo.jpg",
    "get out": "get_out.jpg",
    "gone girl": "gone_girl.jpg",
    "in bruges": "in_burges.jpg",
    "inception": "inception.jpg",
    "indiana jones and the lost ark": "indiana_jones_and_the_lost_ark.jpg",
    "raiders of the lost ark": "indiana_jones_and_the_lost_ark.jpg",
    "interstellar": "interstellar.jpg",
    "jumanji welcome to the jungle": "jumanji_welcome_to_the_jungle.webp",
    "making a murderer": "making_murderer.jpg",
    "pirates of the caribbean": "pirates_of_the_caribbean_black_pearl.jpg",
    "pirates of the caribbean the curse of the black pearl": "pirates_of_the_caribbean_black_pearl.jpg",
    "prisoners": "prisoners.jpg",
    "seven": "seven.jpg",
    "se7en": "seven.jpg",
    "the social dilemma": "social_dilemma.jpg",
    "social dilemma": "social_dilemma.jpg",
    "spirited away": "spirited_away.jpg",
    "superbad": "superbad.png",
    "the conjuring": "the_conjurning.jpg",
    "conjuring": "the_conjurning.jpg",
    "the green mile": "the_green_mile.jpg",
    "green mile": "the_green_mile.jpg",
    "the hangover": "the_hangover.jpg",
    "kac vegas": "the_hangover.jpg",
    "the matrix": "the_matrix.jpg",
    "matrix": "the_matrix.jpg",
    "the menu": "the_menu.jpg",
    "menu": "the_menu.jpg",
    "the shawshank redemption": "the_shawshank.jpg",
    "shawshank redemption": "the_shawshank.jpg",
    "toy story": "toy_story.jpg",
    "wall-e": "wall-e.jpg",
    "walle": "wall-e.jpg"
};

function normalizeTitle(value) {
    return String(value || "")
        .toLowerCase()
        .replace(/:/g, "")
        .replace(/-/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getPosterFile(title) {
    const normalizedTitle = normalizeTitle(title);

    if (posterMap[normalizedTitle]) {
        return posterMap[normalizedTitle];
    }

    const matchingKey = Object.keys(posterMap).find((key) =>
        normalizedTitle.includes(key)
    );

    if (matchingKey) {
        return posterMap[matchingKey];
    }

    return null;
}

function getPosterSrc(title, poster) {
    if (poster) {
        if (poster.startsWith("http")) {
            return poster;
        }

        if (poster.startsWith("/")) {
            return poster;
        }

        if (poster.startsWith("posters/")) {
            return `/${poster}`;
        }

        return `/posters/${poster}`;
    }

    const posterFile = getPosterFile(title);

    if (!posterFile) {
        return null;
    }

    return `/posters/${posterFile}`;
}

function PosterPlaceholder({ large = false, title = "", poster = "" }) {
    const posterSrc = getPosterSrc(title, poster);
    const className = large ? "poster-placeholder large" : "poster-placeholder";

    if (posterSrc) {
        return (
            <div className={className}>
                <img src={posterSrc} alt={title ? `Plakat: ${title}` : "Plakat"} />
            </div>
        );
    }

    return (
        <div className={className}>
            <span className="material-symbols-outlined">movie</span>
            <strong>Poster</strong>
        </div>
    );
}

export default PosterPlaceholder;