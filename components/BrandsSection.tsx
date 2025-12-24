import { useEffect, useState } from 'react';
import { supabase } from '@/components/lib/supabaseClient';

interface Logo {
  id: number;
  name: string;
  logo_url: string;
  is_visible: boolean;
}

interface BrandLogoGalleryProps {
  onSignup: () => void;
}

export default function BrandLogoGallery({ onSignup }: BrandLogoGalleryProps) {
  const [logos, setLogos] = useState<Logo[]>([]);

  useEffect(() => {
    const fetchLogos = async () => {
      const { data, error } = await supabase
        .from('logos') 
        .select('id, name, logo_url, is_visible');

      if (error) {
        console.error('Error fetching logos:', error.message);
      } else if (data) {
       
        const visibleLogos = data.filter((logo) => logo.is_visible);
        setLogos(visibleLogos);
      }
    };

    fetchLogos();
  }, []);

  if (logos.length === 0) return null;

  return (
    <section
  className="
    relative overflow-hidden bg-white 
    py-16 md:py-16 
    rounded-2xl border border-transparent
    hover:border-purple-300 hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
    transition-all duration-300
  "
>
  <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
    
    {/* TITLE */}
    <h2
      className="
        text-3xl md:text-4xl font-bold text-center 
        text-gray-900 
        mb-10 md:mb-12
      "
    >
      Our Brands
    </h2>

    {/* LOGO MARQUEE */}
    <div className="relative w-full overflow-hidden">
      <div className="flex animate-marquee gap-8 w-max">
        {[...logos, ...logos].map((logo, index) => (
          <div
            key={`${logo.id}-${index}`}
            className="flex-shrink-0 w-32 h-20 md:w-40 md:h-24 flex items-center justify-center"
          >
            <img
              src={logo.logo_url}
              alt={logo.name}
              className="max-h-[50px] md:max-h-[60px] w-auto object-contain brightness-95 hover:brightness-110 transition"
            />
          </div>
        ))}
      </div>
    </div>

    {/* CTA BUTTON */}
    <div className="text-center mt-12">
      <button
        onClick={onSignup}
        className="
          text-lg font-extrabold
          px-4 py-3
          rounded-full 
          bg-green-600 text-white 
          hover:bg-green-700
          shadow-md hover:shadow-lg 
          transition
        "
      >
        Start Earning with Our Brands
      </button>
    </div>

  </div>

  {/* ANIMATION CSS */}
  <style>
    {`
      @keyframes marquee {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-marquee {
        animation: marquee 45s linear infinite;
        display: flex;
        width: fit-content;
      }
    `}
  </style>
</section>

  );
}
