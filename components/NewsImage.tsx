import { useEffect, useState } from "react";
import { supabase } from "./lib/supabaseClient";

export default function NewsImage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("visible", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading news:", error.message);
      } else {
        setNews(data || []);
      }

      setLoading(false);
    };

    fetchNews();
  }, []);

  return (
    <section
      id="News"
      className="
        py-20 
        bg-white 
        rounded-2xl 
        border 
        border-gray-200
        shadow-sm 
        px-6 
        max-w-5xl 
        mx-auto
        transition-all 
        duration-300
        hover:border-purple-300
        hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
      "
    >
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
        Latest News
      </h2>

      <p className="text-center text-gray-600 mb-10">
        Stay up to date with our latest updates and announcements.
      </p>

      {/* Loader */}
      {loading && (
        <p className="text-center text-gray-500">Loading news...</p>
      )}

      {/* No news message */}
      {!loading && news.length === 0 && (
        <p className="text-center text-gray-700 text-lg">
          No news available at the moment. Please check back soon! 😊
        </p>
      )}

      {/* News Grid */}
      {!loading && news.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {news.map((item) => (
            <div
              key={item.id}
              className="
                w-full 
                rounded-xl 
                overflow-hidden 
                border 
                border-gray-200
                bg-gray-50
                shadow-sm
                transition-all 
                duration-300 
                hover:shadow-lg 
                hover:border-purple-300
              "
            >
              <img
                src={item.image_url}
                alt="News"
                className="w-full h-48 sm:h-56 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
