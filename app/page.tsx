"use client";

import { useEffect, useState } from 'react';
//import BackgroundAnimation from './BackgroundAnimation';
import BrandCard from '@/components/BrandCard';
import { supabase } from '../components/lib/supabaseClient';
import AdminDashboard from '@/components/AdminDashboard';
import WhyJoin from '@/components/WhyJoin';
import AdminLogin from '@/components/AdminLogin';
import { Session } from '@supabase/supabase-js';
//import Contact from './Contact';
import Faq from '@/components/Faq';
import LoginSignupModal from '@/components/LoginSignupModal';
import NewsImage from '@/components/NewsImage';
import HomeHero from "@/components/HomeHero";
import BackToTopLogo from "@/components/BackToTopLogo";
import ContactQuickModal from "@/components/ContactQuickModal";
//import { useUiSections } from './hooks/useUiSections';
import ContactEmailModal from "@/components/ContactEmailModal";
import CommissionRateMobile from '@/components/CommissionRateMobile';
import Testimonials from '@/components/Testimonials';
// NEW: modal for full instance signup form
import RealmSignupModal from '@/components/RealmSignupModal';
import ThroneSignupModal from '@/components/ThroneSignupModal';
import VidavegasBrSignupModal from '@/components/VidavegasBrSignupModal';
import BluffbetSignupModal from '@/components/BluffbetSignupModal';
import VidavegasLatamSignupModal from '@/components/VidavegasLatamSignupModal';
import JackburstSignupModal from '@/components/JackburstSignupModal';
import PublicBrandLogoGallery from '@/components/BrandsSection';
import { useSearchParams } from "next/navigation";


export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactInstance] = useState<string | null>(null);
  //const { map: ui } = useUiSections(); 
  const [isContactEmailOpen, setIsContactEmailOpen] = useState(false);
  const [openInstance1Form, setOpenInstance1Form] = useState(false);
  const [openThroneForm, setOpenThroneForm] = useState(false);
  // Number of extra brands currently visible per group
  const [visibleExtra, setVisibleExtra] = useState<Record<string, number>>({});
  const [openVidavegasBrForm, setOpenVidavegasBrForm] = useState(false);
  const [openBluffbetSignup, setOpenBluffbetSignup] = useState(false);
  const [openVidavegasLatam, setOpenVidavegasLatam] = useState(false);
  const [openJackburstSignup, setOpenJackburstSignup] = useState(false);
  const searchParams = useSearchParams();
  

  const handleOpenSignupModal = (brand: any) => {
  const g = brand.group?.trim();

  switch (g) {
    case "Realm":
      setOpenInstance1Form(true);
      break;
    case "Throne":
      setOpenThroneForm(true);
      break;
    case "Vidavegas - BR":
      setOpenVidavegasBrForm(true);
      break;
    case "Vidavegas - Latam":
      setOpenVidavegasLatam(true);
      break;
    case "Bluffbet":
      setOpenBluffbetSignup(true);
      break;
    case "Jackburst":
      setOpenJackburstSignup(true);
      break;
    default:
      console.warn("Unknown brand group:", g);
  }
};



  


  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };
  const [signupByInstance, setSignupByInstance] = useState<Record<string, string>>({});

  // 🟢 Fetch signup links by instance (auth table)
  const fetchSignupLinks = async () => {
    const { data, error } = await supabase
      .from('auth_links')
      .select('instance, signup');

    if (error) {
      console.error('Error fetching signup links:', error.message);
      return;
    }

    if (data) {
      const map: Record<string, string> = {};
      data.forEach((row: any) => {
        if (row.instance && row.signup) map[row.instance] = row.signup;
      });
      setSignupByInstance(map);
    }
  };


  const getSignupForBrand = (brand: any) => {
  const byBrand = (brand.signup_url || '').trim();
  if (byBrand) return byBrand;

  const key = (brand.group || '').trim();
  return signupByInstance[key] || undefined;
};

  useEffect(() => {
    const fetchBrands = async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*, signup_url')
        .eq('is_visible', true)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching brands:', error.message);
      } else {
        setBrands(data || []);
      }
    };



    // Ejecutar junto con los demás fetch
    fetchBrands();
    fetchSignupLinks();

    // 🟣 Admin Authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const isAdmin = searchParams.get("admin") === "true";

  if (isAdmin) {
    return session ? <AdminDashboard /> : <AdminLogin />;
  }

  const groupOrder = ['Realm', 'Throne', 'Neatplay'];

  const groupedBrands = groupOrder.map((groupName) => {
  if (groupName === 'Neatplay') {
    return {
      groupName,
      brands: brands.filter((b) =>
        ['Vidavegas - Latam', 'Vidavegas - BR', 'Bluffbet', 'Jackburst']
          .includes(b.group)
      ),
    };
  }

  return {
    groupName,
    brands: brands.filter((b) => b.group === groupName),
  };
});

const showMore = (groupName: string, maxExtra: number) => {
  setVisibleExtra(prev => {
    const current = prev[groupName] || 0;
    const next = current + 3;

    if (next >= maxExtra) {
      return { ...prev, [groupName]: maxExtra }; // reached the end
    }
    return { ...prev, [groupName]: next };
  });
};

const showLess = (groupName: string) => {
  // collapse extra cards
  setVisibleExtra(prev => ({ ...prev, [groupName]: 0 }));

  // smooth scroll to CommissionRate header after collapse
  setTimeout(() => {
    const section = document.getElementById("CommissionRate");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 300); // waits 300ms so collapse looks natural
};




  // return


  return (
    
    <div className="font-sans min-h-screen bg-gray-50 scroll-smooth">
      {/* Navbar */}

<nav className="fixed top-0 left-0 w-full bg-white shadow z-20 px-6 pt-2 pb-2 flex justify-between items-center">

  {/* Logo - Takes to TOP */}
  <div 
    onClick={() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMenuOpen(false);
    }}
    className="flex items-center gap-2"
  >
    <img src="/logo.png" alt="Logo" className="h-10 w-25 cursor-pointer hover:brightness-125" />
  </div>

    {/* Hamburguer Menu */}
      <div className="md:hidden flex items-center gap-2 px-3">
      {/* 🟢 Login Button (Mobile Only) */}
      <button
          onClick={() => setModalType('login')}
          className="rounded-xl bg-green-600 px-5 py-2 text-white font-bold hover:bg-green-800 transition"
      >
          Login
      </button>

      {/* 🟢 Hamburguer Menu (Increased Size) */}
      <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-purple-700 text-2xl" 
      >
          {menuOpen ? '✕' : '☰'}
      </button>
  </div>

{/* Desktop nav */}
<div className="font-bold hidden md:flex flex-wrap gap-1 justify-end w-full max-w-full">

  {[
    'WhyJoin',
    'News',
    'OurBrands',
    'CommissionRate',
    'Contact',
    'FAQ',
  ].map((id) => (
  <button
    key={id}
    onClick={() => {
      if (id === 'Contact') {
        setIsContactEmailOpen(true); // open popup instead of scrolling
      } else {
        scrollToSection(id);
      }
    }}
    className="text-gray-700 font-bold text-base px-3 py-2 rounded border border-transparent
    hover:border-purple-300
    hover:text-purple-700
    hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
    transition-all duration-300
    rounded-2xl"
    >
    {id.replace(/([A-Z])/g, ' $1').trim()}
  </button>
))}

  <button
    onClick={() => setModalType('signup')}
    className="bg-green-600 text-white px-3 py-0 rounded hover:bg-green-800"
  >
    Register
  </button>

  <button
    onClick={() => setModalType('login')}
    className="bg-purple-600 text-white px-3 py-0 rounded hover:bg-purple-800"
  >
    Login
  </button>

</div>

</nav>


      {/* Mobile Menu Dropdown */}
{menuOpen && (
  <div className="font-bold md:hidden fixed top-16 left-0 w-full bg-white shadow-lg z-50 px-4 py-4">
    {[
      { id: 'WhyJoin', label: 'Why Join' },
      { id: 'News', label: 'News' },
      { id: 'OurBrands', label: 'Our Brands' },
      { id: 'CommissionRate', label: 'Commission Rate' },
      //{ id: 'Contact', label: 'Contact' },
      { id: 'FAQ', label: 'FAQ' },
    ].map(({ id, label }) => (
      <button
        key={id}
        onClick={() => scrollToSection(id)}
        className="block w-full text-left text-gray-700 py-2 px-2 rounded hover:bg-gray-100"
      >
        {label}
      </button>
    ))}

    {/* Login/Signup en mobile */}
    <button
      onClick={() => { setModalType('signup'); setMenuOpen(false); }}
      className="block w-full text-left text-green-700 py-2 px-2 font-medium hover:bg-green-100"
    >
      Signup
    </button>
  </div>
)}

      {/* Main content */}
      <div className='pt-24 px-18 sm:px-10 md:px-10 lg:px-16'>
        <HomeHero
          onLogin={() => setModalType('login')}
          onSignup={() => setModalType('signup')}
          onScrollNext={() => {
            const faqSection = document.getElementById('WhyJoin');
            faqSection?.scrollIntoView({ behavior: 'smooth' });
          }}
          />
      </div>

      <main className="max-w-6xl mx-auto px-4 space-y-12 md:space-y-12">

        

        {
          <WhyJoin />
        }

        {
          <section id="News">
          <NewsImage />
          </section>
        }

        
        <div id="OurBrands">
        {/* 🎯 Pass the onSignup function */}
        <PublicBrandLogoGallery 
          onSignup={() => setModalType('signup')} 
        />
        </div>

        {/* ✅ Commission Rate with Tailwind styling applied */}
          <section
            id="CommissionRate"
            className="
              bg-white 
              pt-6 md:pt-24 pb-6
              border-2 rounded-2xl
              border-transparent
              hover:border-purple-300
              hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
              transition-all duration-300
            "
          >
            <div className="max-w-[1200px] mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">
                Commission Rate
              </h2>

              <p className="text-center text-gray-500 mb-8 text-base hover:font-bold transition">
                Earn more as you grow. Our laddered commission system rewards your success.
              </p>

              <div className="space-y-10 mt-6">
                {groupedBrands.map(({ groupName, brands }) => (
                  brands.length > 0 && (
                    <section
                      key={groupName}
                      className="
                        p-6 bg-transparent rounded-lg border shadow-sm
                        border-transparent
                      "
                    >

                      {/* MOBILE */}
                      <div className="md:hidden -mx-20 px-4">
                        <CommissionRateMobile 
                          brands={brands.map(brand => ({
                            ...brand,
                            signup_url: getSignupForBrand(brand),
                          }))}
                          handleOpenSignupMobile={handleOpenSignupModal}
                        />
                      </div>

                      {/* DESKTOP */}
                      <div className="hidden md:flex flex-col items-center bg-white rounded-2xl border">

                        {/* Always 3 initial cards */}
                        <div className="
                          grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 
                          gap-8 justify-items-center w-full p-6 rounded-2xl
                          border-transparent
                          hover:border-purple-300
                          hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
                          transition-all duration-300
                        ">
                          {brands.slice(0, 3).map((brand) => (
                            <BrandCard
                              key={brand.id}
                              id={brand.id}
                              logoUrl={brand.logo_url}
                              name={brand.name}
                              commissionTiers={brand.commission_tiers || []}
                              commissionType={brand.commission_type}
                              isVisible={brand.is_visible}
                              commission_tiers_label={brand.commission_tiers_label}
                              onSave={() => {}}
                              isPublicView={true}
                              onJoin={() => handleOpenSignupModal(brand)}
                            />
                          ))}
                        </div>

                        {/* LOAD MORE */}
                        {brands.length > 3 && (
                          <div className="w-full px-6 mt-2">
                            <div className="
                              grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 
                              gap-8 justify-items-center
                            ">
                              {brands
                                .slice(3, 3 + (visibleExtra[groupName] || 0))
                                .map((brand) => (
                                  <BrandCard
                                    key={brand.id}
                                    id={brand.id}
                                    logoUrl={brand.logo_url}
                                    name={brand.name}
                                    commissionTiers={brand.commission_tiers || []}
                                    commissionType={brand.commission_type}
                                    isVisible={brand.is_visible}
                                    commission_tiers_label={brand.commission_tiers_label}
                                    onSave={() => {}}
                                    isPublicView={true}
                                    onJoin={() => handleOpenSignupModal(brand)}
                                  />
                                ))}
                            </div>

                            {/* BUTTONS */}
                            <div className="flex justify-center gap-4 mt-4 my-3">

                              {/* SHOW MORE */}
                              {(visibleExtra[groupName] || 0) < brands.length - 3 && (
                                <button
                                  onClick={() => showMore(groupName, brands.length - 3)}
                                  className="
                                    px-6 py-2 rounded-full 
                                    bg-purple-600 text-white font-semibold
                                    hover:bg-purple-700 hover:font-bold
                                    transition duration-300
                                  "
                                >
                                  Show More
                                </button>
                              )}

                              {/* SHOW LESS */}
                              {(visibleExtra[groupName] || 0) > 0 && (
                                <button
                                  onClick={() => showLess(groupName)}
                                  className="
                                    px-6 py-2 rounded-full 
                                    bg-gray-200 text-gray-800 font-semibold 
                                    hover:bg-gray-300 
                                    hover:border-purple-300 hover:text-purple-700 
                                    hover:font-bold
                                    hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
                                    border border-transparent
                                    transition-all duration-300
                                  "
                                >
                                  Show Less
                                </button>
                              )}

                            </div>
                          </div>
                        )}

                      </div>

                    </section>
                  )
                ))}
              </div>
            </div>
          </section>


        {/* Contact Section
        {ui.contact_section !== false && (
          <>
            <Contact />
            <br />
          </>
        )}
          */}
        
        <div id="Testimonials">
        <Testimonials />
        </div>

        <section id="FAQ">
        {/* 🎯 PASS THE onSignup PROP TO FAQ */}
        <Faq onSignup={() => setModalType('signup')} />
        </section>

      {/* Login and Signup Section */}
      <div className="py-16 text-center bg-white border border-transparent
        hover:border-purple-300
        hover:shadow-[0_0_12px_rgba(109,0,220,0.35)]
        transition-all duration-300
        rounded-2xl
        ">

          <h2 className="text-3xl font-bold mb-6">Join Neat Affiliates Today!</h2>
          <h3 className="text-lg text-gray-600 mb-6">
            Sign up now to start earning commissions with ease.
          </h3>
          
          <button
            onClick={() => setModalType('signup')}
            className="text-base sm:text-lg lg:text-xl font-bold bg-green-600 text-white px-5 py-2 rounded mx-2 hover:bg-green-800"
          >
            Get Started
          </button>

          {modalType && (
            <LoginSignupModal
              isOpen={true}
              type={modalType}
              onClose={() => setModalType(null)}
              onInstance1Signup={() => setOpenInstance1Form(true)}  // 🔥 NEW
              onInstance2Signup={() => setOpenThroneForm(true)}
              onInstanceVidavegasBrSignup={() => setOpenVidavegasBrForm(true)}
              onBluffbetSignup={() => setOpenBluffbetSignup(true)}
              onVidavegasLatamSignup={() => setOpenVidavegasLatam(true)}
              onJackburstSignup={() => setOpenJackburstSignup(true)}

            />
          )}
      </div>


    {/* Footer logo + mobile FAB */}
    <BackToTopLogo homeAnchorId="HomeHero" />
    <ContactQuickModal
      isOpen={contactOpen}
      instance={contactInstance}
      onClose={() => setContactOpen(false)}
    />
    {/* Desktop-only floating Contact button (bottom-left) */}
{!isContactEmailOpen && (
  <button
    type="button"
    onClick={() => setIsContactEmailOpen(true)}
    className="
      hidden 
      lg:flex
      fixed left-4 
      bottom-4 
      z-[10000]
      px-3 py-2
      bg-purple-700 
      text-white 
      rounded-full 
      shadow-md 
      text-sm
      font-semibold
      hover:bg-purple-800 
      active:scale-95
      transition-all
      duration-200
    "
  >
    Telegram 💬
  </button>
)}


    {/* Mobile-only floating Contact button (bottom-left) */}
{!isContactEmailOpen && (
  <button
    type="button"
    onClick={() => setIsContactEmailOpen(true)}
    className="
      fixed left-4 
      bottom-6
      bottom-[calc(1rem+env(safe-area-inset-bottom))] 
      z-[10000] 
      md:hidden 
      h-12 w-12 
      rounded-full 
      bg-green-600 
      shadow-lg 
      flex items-center justify-center
      text-2xl 
      hover:bg-green-800 
      active:scale-[0.98] 
      transition
    "
    aria-label="Open Contact form"
    title="Contact"
  >
    <span className="leading-none">💬</span>
  </button>
)}

{/* Global Contact modal (opens from navbar or FAB) */}
<ContactEmailModal
  isOpen={isContactEmailOpen}
  onClose={() => setIsContactEmailOpen(false)}
/>

<RealmSignupModal
  isOpen={openInstance1Form}
  onClose={() => setOpenInstance1Form(false)}
/>

<ThroneSignupModal
  isOpen={openThroneForm}
  onClose={() => setOpenThroneForm(false)}
/>

<VidavegasBrSignupModal
  isOpen={openVidavegasBrForm}
  onClose={() => setOpenVidavegasBrForm(false)}
/>

<BluffbetSignupModal
  isOpen={openBluffbetSignup}
  onClose={() => setOpenBluffbetSignup(false)}
/>

<VidavegasLatamSignupModal
  isOpen={openVidavegasLatam}
  onClose={() => setOpenVidavegasLatam(false)}
/>

<JackburstSignupModal
  isOpen={openJackburstSignup}
  onClose={() => setOpenJackburstSignup(false)}
/>




    </main>
    </div>

    
  );
}
