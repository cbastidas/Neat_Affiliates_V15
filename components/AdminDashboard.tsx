import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/components/lib/supabaseClient';
import BrandCard from './BrandCard';
import AddBrandModal from './AddBrandModal';
import WhyJoinEditor from './WhyJoinEditor';
import ContactEditor from './ContactEditor';
import FaqEditor from './FaqEditor';
import AuthEditor from './AuthEditor';
import LogoVisibilityManager from './LogoVisibilityManager';
import SectionVisibilityToggle from "./SectionVisibilityToggle";
import NewsImageEditor from "./NewsImageEditor";


// ------------------------------------------------------
// DND-KIT IMPORTS
// ------------------------------------------------------
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


// ------------------------------------------------------
// SORTABLE WRAPPER FOR EACH BRANDCARD
// ------------------------------------------------------
function SortableBrandCard({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      {/* Drag handle – solo esto es draggable */}
      <button
        type="button"
        className="
          absolute -top-2 -left-2 z-10
          w-6 h-6 rounded-full
          bg-purple-600 text-white text-xs
          flex items-center justify-center
          cursor-move shadow
        "
        {...attributes}
        {...listeners}
        onClick={(e) => e.preventDefault()} // que no dispare clicks en la card
      >
        ☰
      </button>

      {children}
    </div>
  );
}


// ------------------------------------------------------
// MAIN ADMIN DASHBOARD
// ------------------------------------------------------
interface CommissionTier {
  range: string;
  rate: string;
}

interface Brand {
  id: string;
  name: string;
  logo_url: string;
  commission_text: string;
  commission_type: string;
  about: string;
  is_visible: boolean;
  commission_tiers: CommissionTier[];
  group?: string;
  order?: number;
}

export default function AdminDashboard() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const whyJoinRef = useRef<HTMLDivElement>(null);
  const commissionRef = useRef<HTMLDivElement>(null);
  const brandsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const loginRef = useRef<HTMLDivElement>(null);

  // DND sensors
  const sensors = useSensors(useSensor(PointerSensor));


  // ------------------------------------------------------
  // LOAD BRANDS FROM SUPABASE ORDERED BY 'order'
  // ------------------------------------------------------
  const fetchBrands = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error loading brands:', error);
    } else {
      setBrands(data || []);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  useEffect(() => {
    fetchBrands();
  }, []);


  // ------------------------------------------------------
  // RENDER
  // ------------------------------------------------------
  return (
    <div className="p-6">

      {/* FIXED TOP NAVBAR */}
      <div className="fixed top-0 left-0 w-full bg-white shadow z-20 p-4 flex justify-between items-center">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          <img
            src="./logo.png"
            alt="Logo"
            className="h-10 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <h1 className="text-xl font-bold">Admin Dashboard</h1>

          <button
            onClick={handleLogout}
            className="ml-2 bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>

        {/* RIGHT SIDE - NAVIGATION BUTTONS */}
        <div className="flex gap-4">
          <button onClick={() => whyJoinRef.current?.scrollIntoView({ behavior: 'smooth' })}>Why Join</button>
          <button onClick={() => commissionRef.current?.scrollIntoView({ behavior: 'smooth' })}>Commission Rate</button>
          <button onClick={() => brandsRef.current?.scrollIntoView({ behavior: 'smooth' })}>Our Brands</button>
          <button onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })}>Contact</button>
          <button onClick={() => faqRef.current?.scrollIntoView({ behavior: 'smooth' })}>FAQ</button>
        </div>

      </div>



      {/* ------------------------------------------------------
          PAGE CONTENT
      ------------------------------------------------------ */}
      <div className="pt-28 space-y-16">

        {/* WHY JOIN */}
        <section ref={whyJoinRef}>
          <WhyJoinEditor />
        </section>


        {/* ------------------------------------------------------
            COMMISSION RATE (WITH DRAG & DROP)
        ------------------------------------------------------ */}
        <section ref={commissionRef}>
          <h2 className="text-2xl font-bold text-center mb-6">Commission Rate</h2>

          {/* Add Brand button + modal */}
          <AddBrandModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSave={fetchBrands}
          />

          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              ➕ Add Brand
            </button>
          </div>

          {/* BRAND LIST WITH DRAG & DROP */}
          {loading ? (
            <p className="text-center">Loading brands...</p>
          ) : (
            <div className="mt-8">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={async (event) => {
                  const { active, over } = event;
                  if (!over || active.id === over.id) return;

                  const oldIndex = brands.findIndex((b) => b.id === active.id);
                  const newIndex = brands.findIndex((b) => b.id === over.id);

                  const reordered = arrayMove(brands, oldIndex, newIndex);

                  setBrands(reordered);

                  // SAVE ORDER TO SUPABASE
                  const updates = reordered.map((b, index) => ({
                    id: b.id,
                    order: index,
                  }));

                  const { error } = await supabase.from("brands").upsert(updates);
                  if (error) console.error("Error saving drag order:", error);
                }}
              >
                <SortableContext
                  items={brands.map((b) => b.id)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">

                    {brands.map((brand) => (
                      <SortableBrandCard key={brand.id} id={brand.id}>
                        <BrandCard
                          id={brand.id}
                          logoUrl={brand.logo_url}
                          name={brand.name}
                          commissionTiers={brand.commission_tiers || []}
                          commissionType={brand.commission_type}
                          isVisible={brand.is_visible}
                          onSave={fetchBrands}
                          group={brand.group}
                        />
                      </SortableBrandCard>
                    ))}

                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </section>


        {/* OUR BRANDS */}
        <section ref={brandsRef}>
          <LogoVisibilityManager />
        </section>


        {/* CONTACT */}
        <section ref={contactRef}>
          <SectionVisibilityToggle sectionKey="contact_section" size="md" />
          <h2 className="text-2xl font-bold text-center mb-6">📬 Contact Admin Editor</h2>
          <ContactEditor />
        </section>


        {/* FAQ */}
        <section ref={faqRef}>
          <h2 className="text-2xl font-bold text-center mb-6">❓ FAQ Admin Editor</h2>
          <FaqEditor />
        </section>


        {/* LOGIN / SIGNUP */}
        <section ref={loginRef}>
          <h2 className="text-2xl font-bold text-center mb-6">🔐 Login/Signup Admin Editor</h2>
          <AuthEditor />
        </section>

        <section id="news">
          <NewsImageEditor />
        </section>


      </div>
    </div>
  );
}
