

export type WhyJoinItem = {
  id: string;
  title: string;        // Usaremos este como número grande o frase corta
  description: string;  // Subtexto debajo
  emoji_url?: string;
};

export default function WhyJoinMobileCarousel({
  items,
  className = "",
}: {
  items: WhyJoinItem[];
  className?: string;
}) {
  return (
    <div className={`w-full px-5 ${className}`}>
      <div className="flex flex-col gap-10 py-6">

        {items.map((it) => (
          <div key={it.id} className="flex flex-col">

            {/* Emoji opcional */}
            {it.emoji_url && (
              <img
                src={it.emoji_url}
                alt={it.title}
                className="w-12 h-12 object-contain mb-3 opacity-90"
              />
            )}

            {/* NÚMERO / TÍTULO GRANDE */}
            <h3 className="text-4xl font-extrabold text-[#6D00DC] leading-none">
              {it.title}
            </h3>

            {/* SUBTÍTULO / DESCRIPCIÓN */}
            <p className="text-gray-600 text-base leading-tight mt-1">
              {it.description}
            </p>

          </div>
        ))}

      </div>
    </div>
  );
}
