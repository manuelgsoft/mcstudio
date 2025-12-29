const cards = [
  {
    title: "Custom trips, not packages",
    copy: "One-on-one consulting so every route, stay, and pace fits you.",
    image:
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    title: "Detail-obsessed studio",
    copy: "We curate options, refine aesthetics, and keep logistics smooth.",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
  {
    title: "Destinations that inspire",
    copy: "Asia, the Americas, Oceania, and curated Europe escapes.",
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.1.0",
  },
];

export default function Info() {
  return (
    <section className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-5 pb-20 pt-16 text-center sm:px-8 lg:pb-24">
      <div className="max-w-3xl space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
          Tailor-made experiences
        </p>
        <h2 className="text-3xl font-semibold text-[#0b1930] sm:text-4xl">
          A travel studio built around you
        </h2>
        <p className="text-base text-[#3d4a68] sm:text-lg">
          We focus on what sells your trip: evocative places, thoughtful pacing, and a plan that
          feels effortless.
        </p>
      </div>

      <div className="grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.title}
            className="group relative overflow-hidden rounded-3xl bg-white shadow-[0_18px_55px_rgba(12,17,43,0.1)] ring-1 ring-[#e7eaf3] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(12,17,43,0.14)]"
          >
            <div
              className="h-48 w-full bg-cover bg-center transition duration-300 group-hover:scale-105"
              style={{ backgroundImage: `url(${card.image})` }}
            />
            <div className="space-y-2 px-5 pb-5 pt-4 text-left">
              <h3 className="text-lg font-semibold text-[#0b1930]">{card.title}</h3>
              <p className="text-sm text-[#3d4a68]">{card.copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
