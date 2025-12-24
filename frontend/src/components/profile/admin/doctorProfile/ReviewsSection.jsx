const ReviewCard = ({ title, name, text, rating = 4 }) => (
    <div className="border border-slate-200 rounded-md px-4 py-3 bg-slate-50 mb-2">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>{title}</span>
            <span className="text-emerald-500 font-semibold">
                {"★".repeat(rating)}{" "}
            </span>
        </div>
        <p className="text-xs text-slate-500 mb-1">Name : {name}</p>
        <p className="text-xs text-slate-600 leading-snug">{text}</p>
    </div>
);

const ReviewsSection = ({ reviews = [] }) => {
    const data =
        reviews.length > 0
            ? reviews
            : [
                {
                    id: 1,
                    title: "Patient 1 · MED‑1324 · 5/5",
                    name: "Jithu Sudharshan",
                    text:
                        "She was very kind and explained everything very well. Her bedside manner is very good.",
                },
                {
                    id: 2,
                    title: "Patient 2 · MED‑1324 · 5/5",
                    name: "Jithu Sudharshan",
                    text:
                        "She was very kind and explained everything very well. Her bedside manner is very good.",
                },
            ];

    return (
        <section className="border border-slate-200 rounded-xl mb-4">
            <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between">
                <p className="text-xs text-[#008989] uppercase tracking-wide">
                    Reviews &amp; Feedback
                </p>
            </div>
            <div className="px-6 py-3">
                {data.map((r) => (
                    <ReviewCard key={r.id} {...r} />
                ))}
            </div>
        </section>
    );
};

export default ReviewsSection;
