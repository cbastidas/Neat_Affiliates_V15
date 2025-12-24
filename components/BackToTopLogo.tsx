// BackToTopLogo.tsx
// Desktop: green floating up-arrow button (bottom-left)
// Mobile: purple floating up-arrow button (bottom-left)

import { useEffect, useState } from "react";

type Props = {
  homeAnchorId?: string;
};

export default function BackToTopLogo({ homeAnchorId }: Props) {
  const [showFab, setShowFab] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowFab(window.scrollY > 240);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    const el = homeAnchorId ? document.getElementById(homeAnchorId) : null;
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Desktop floating button (green arrow) */}
      {showFab && (
        <button
          onClick={goTop}
          aria-label="Back to top"
          className="
            hidden md:flex 
            fixed bottom-5 right-5 
            z-40 w-10 h-10
            rounded-full 
            bg-green-600 text-white 
            shadow-xl 
            items-center justify-center 
            active:scale-95 
            transition 
            hover:bg-green-800
          "
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Mobile floating button (purple) */}
      {showFab && (
        <button
          onClick={goTop}
          aria-label="Back to top"
          className="
            md:hidden 
            fixed bottom-6 right-4 
            z-40 w-12 h-12 
            rounded-full 
            bg-purple-600 text-white 
            shadow-lg 
            flex items-center justify-center 
            active:scale-95 
            transition 
            hover:bg-purple-900
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
}
