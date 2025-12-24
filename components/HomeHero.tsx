// HomeHero.tsx
// A simple top-of-page hero section (no navbar link). All UI text is in English for consistency.
// Comments are in English.

//import React from "react";

type Props = {
  onLogin?: () => void;
  onSignup?: () => void;
  onScrollNext?: () => void; // scroll to the next section (e.g., WhyJoin)
};

export default function HomeHero({ onSignup, onScrollNext }: Props) {
  return (
    <section
      id="HomeHero"
      className="relative rounded-2xl isolate overflow-hidden bg-white pt-24 pb-10 sm:pt-32 sm:pb-16
                hover:border-purple-300
                hover:rounded-2xl
                 hover:font-bold
                 hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
                 transition-all 
                 duration-300"
      style={{ paddingTop: "5rem" }} // offset for fixed navbar
    >
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight text-gray-900">
          Grow your affiliate revenue with <br></br>Neat Affiliates
        </h1>

        <p className="mt-3 sm:mt-4 text-base sm:text-lg text-gray-600">
          Tools, reporting and flexible deals to help you scale—fast.
        </p>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={onSignup}
            className="font-extrabold sm:text-lg lg:text-lg rounded-xl bg-green-600 px-6 py-3 text-white hover:bg-green-800 hover:font-bold transition"
          >
            Register Now and Start Earning
          </button>
        </div>
      <div className="mt-4 sm:mt-5 flex justify-center">
        <button
            onClick={onScrollNext}
            className="rounded-xl border px-5 py-2 sm:px-6 sm:py-3 
                       text-gray-700 hover:text-purple-700 
                       hover:border-purple-300 hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
                       transition-all duration-300
                       "
            aria-label="Scroll to next section"
          >
            Learn more
          </button>
        </div>
        
        {/* 
        <div className="mt-12">
          <button
            onClick={onScrollNext}
            className="animate-bounce text-gray-500 hover:text-gray-700"
            aria-label="Scroll to next section"
          >
            ↓
          </button>
        </div>
          */}

        
      </div>
    </section>
  );
}
