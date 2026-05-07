const items = [
  "UC San Diego",
  "Victory Capital",
  "Data Science",
  "Machine Learning",
  "Startup Incubator",
  "Business Intelligence",
  "DS3",
  "Venture Capital",
  "Product Management",
  "Artificial Intelligence",
];

export default function MarqueeBar() {
  const all = [...items, ...items];

  return (
    <div className="border-y border-zinc-100 py-5 overflow-hidden">
      <div className="marquee-track">
        {all.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span className="text-sm font-display font-medium text-zinc-500 whitespace-nowrap px-6">
              {item}
            </span>
            <span className="text-zinc-200 select-none">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
