function TitleMetaGrid({ title }) {
    const items = [
        {
            label: "Rok",
            value: title.year || "Brak danych",
        },
        {
            label: "Czas trwania",
            value: title.duration || "Brak danych",
        },
        {
            label: "Ocena",
            value: title.rating ? `★ ${title.rating}` : "Brak danych",
        },
        {
            label: "Wiek",
            value: title.ageRating || "Brak danych",
        },
    ];

    return (
        <div className="title-meta-grid">
            {items.map((item) => (
                <div className="title-meta-box" key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                </div>
            ))}
        </div>
    );
}

export default TitleMetaGrid;