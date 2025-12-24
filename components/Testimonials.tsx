'use client';

import { useEffect, useState, useRef } from "react";
import { supabase } from "./lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import TestimonialsEditor from "./TestimonialsEditor";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: string;
  title: string;
  content: string;
  link: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [maxScrollIndex, setMaxScrollIndex] = useState(0);

  // Auto-slide
  const autoTimer = useRef<NodeJS.Timeout | null>(null);
  const userInteracting = useRef(false);

  useEffect(() => {
    const fetchTestimonials = async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

      setTestimonials(data || []);
    };
    fetchTestimonials();
  }, []);

  const calculateMaxScroll = () => {
    const el = trackRef.current;
    if (!el || testimonials.length === 0) {
      setMaxScrollIndex(0);
      return;
    }

    const slideEl = el.querySelector(
      ".testimonial-slide"
    ) as HTMLElement | null;
    if (!slideEl) return;

    const slideWidth = slideEl.clientWidth;
    const visibleSlidesCount = Math.floor(el.clientWidth / slideWidth);
    const max = testimonials.length - visibleSlidesCount;

    const clampedMax = Math.max(0, max);
    setMaxScrollIndex(clampedMax);
    setActive((i) => Math.min(i, clampedMax));
  };

  useEffect(() => {
    calculateMaxScroll();
    window.addEventListener("resize", calculateMaxScroll);
    return () => window.removeEventListener("resize", calculateMaxScroll);
  }, [testimonials]);

  // Manual scroll actualiza índice activo
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;

    const slideEl = el.querySelector(
      ".testimonial-slide"
    ) as HTMLElement | null;
    if (!slideEl) return;

    const cardWidth = slideEl.clientWidth;
    const i = Math.round(el.scrollLeft / cardWidth);
    setActive(Math.min(i, maxScrollIndex));

    userInteracting.current = true;
    resetAutoSlide();
  };

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;

    const slideEl = el.querySelector(
      ".testimonial-slide"
    ) as HTMLElement | null;
    if (!slideEl) return;

    const cardWidth = slideEl.clientWidth;
    const clamped = Math.max(0, Math.min(i, maxScrollIndex));

    el.scrollTo({ left: clamped * cardWidth, behavior: "smooth" });
    setActive(clamped);
  };

  const next = () => {
    const nextIndex = active < maxScrollIndex ? active + 1 : 0;
    goTo(nextIndex);
  };

  const prev = () => {
    const prevIndex = active > 0 ? active - 1 : maxScrollIndex;
    goTo(prevIndex);
  };

  // Auto slide
  const startAutoSlide = () => {
    if (autoTimer.current) clearInterval(autoTimer.current);

    autoTimer.current = setInterval(() => {
      if (userInteracting.current) return;
      next();
    }, 4000);
  };

  const resetAutoSlide = () => {
    userInteracting.current = true;
    if (autoTimer.current) clearInterval(autoTimer.current);

    // tras 2s de inactividad, volvemos a permitir auto-slide
    setTimeout(() => {
      userInteracting.current = false;
    }, 2000);

    startAutoSlide();
  };

  useEffect(() => {
    if (!testimonials.length) return;
    startAutoSlide();
    return () => {
      if (autoTimer.current) clearInterval(autoTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testimonials, maxScrollIndex]);

  // Touch: pausar mientras el usuario hace swipe manual
  const handleTouchStart = () => {
    userInteracting.current = true;
    if (autoTimer.current) clearInterval(autoTimer.current);
  };

  const handleTouchEnd = () => {
    userInteracting.current = false;
    startAutoSlide();
  };

  if (isAdmin) return <TestimonialsEditor />;
  if (testimonials.length === 0) return null;

  return (
    <section
      id="Testimonials"
      className="py-2 px-3 sm:pt-16 text-center bg-white
      border border-transparent
    hover:border-purple-300
    hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
    transition-all duration-300
    rounded-2xl"
    >
      <h2 className="text-4xl font-bold mb-4 text-purple-900">✨ Testimonials</h2>
      <p className="text-base text-gray-600 mb-6 hover:font-bold transition">
        Here is what our partners say about us.
      </p>

      <div className="max-w-6xl mx-auto relative">

        {/* Sliders onlyon Desktop */}
        <button
          onClick={prev}
          onMouseEnter={() => {
            userInteracting.current = true;
            if (autoTimer.current) clearInterval(autoTimer.current);
          }}
          onMouseLeave={() => {
            userInteracting.current = false;
            startAutoSlide();
          }}
          className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 
                     bg-white p-2 rounded-full shadow border hover:bg-gray-100 z-10"
        >
          <ChevronLeft className="w-6 h-6 text-purple-600" />
        </button>

        {/* TRACK: scroll/touch + auto-slide */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="
            relative flex overflow-x-auto
            snap-x snap-mandatory
            scroll-smooth
            [-webkit-overflow-scrolling:touch]
            no-scrollbar
            w-full
            px-2
            mx-2
          "
        >
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="
                testimonial-slide 
                snap-start shrink-0 
                w-full sm:w-1/2 lg:w-1/3 
                px-3 sm:px-6 mb-4 
              "
            >
              <div className="
                group
                bg-white 
                px-4 py-4 sm:px-6 sm:py-6 
                rounded-2xl shadow-md 
                border border-gray-200
                hover:border-purple-300
                hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
                transition-all duration-300
                h-full flex flex-col
              ">

                {/* TITLE */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 group-hover:text-purple-700 transition">
                  {t.title}
                </h3>

                {/* LINK */}
                {t.link && (
                  <a
                    href={t.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      text-purple-600 text-sm mb-3 block 
                      hover:text-purple-800 transition
                    "
                  >
                    Visit Page →
                  </a>
                )}

                {/* CONTENT */}
                <p className="
                  text-gray-700 leading-relaxed italic
                  border-l-4 border-purple-300 pl-3
                  group-hover:font-bold group-hover:text-purple-600
                  transition
                ">
                  "{t.content}"
                </p>
              
              </div>
              </div>

          ))}
        </div>

        {/* Flecha derecha (solo desktop/tablet) */}
        <button
          onClick={next}
          onMouseEnter={() => {
            userInteracting.current = true;
            if (autoTimer.current) clearInterval(autoTimer.current);
          }}
          onMouseLeave={() => {
            userInteracting.current = false;
            startAutoSlide();
          }}
          className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 
                     bg-white p-2 rounded-full shadow border hover:bg-gray-100 z-10"
        >
          <ChevronRight className="w-6 h-6 text-purple-600" />
        </button>

        {/* Dots */}
        <div className="mt-5 flex items-center justify-center gap-2">
          {Array.from({ length: maxScrollIndex + 1 }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-2.5 rounded-full transition 
                ${i === active ? "bg-purple-700 w-6" : "bg-gray-300 w-2.5"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
