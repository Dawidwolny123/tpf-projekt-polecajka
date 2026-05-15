function PosterPlaceholder({ large = false }) {
  return (
    <div className={large ? "poster-placeholder large" : "poster-placeholder"}>
      <span>Poster</span>
    </div>
  );
}

export default PosterPlaceholder;
