import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const VidavegasBrSignupModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [logo, setLogo] = useState<string | null>(null);

  // Load Vidavegas BR logo dynamically
  useEffect(() => {
    if (!isOpen) return;

    const loadLogo = async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("logo_url")
        .eq("name", "Vidavegas BR")
        .single();

      if (!error && data?.logo_url) setLogo(data.logo_url);
    };

    loadLogo();
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* MODAL */}
      <div className="bg-white w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-xl p-8 relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl text-gray-500 hover:text-gray-800"
        >
          ×
        </button>

            {/* Title */}
            <h2 className="text-center text-3xl font-semibold mb-4">
              Create Your Affiliate Account
            </h2>

            {/* Subtitle */}
            <p className="text-center text-gray-600 mb-8">
              Please fill in the form below to create your account for the brand shown below.
            </p>

            {/* Vidavegas BR logo */}
            <div className="w-full flex justify-center mb-8">
              {logo && (
                <img
                  src={logo}
                  alt="Vidavegas BR"
                  className="h-14 w-auto object-contain"
                />
              )}
            </div>


        {/* FORM */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Username */}
          <div className="flex flex-col">
            <label className="font-semibold">* Login username</label>
            <small className="text-gray-500">
              Please ensure your username contains only letters, numbers, hyphens (-), and underscores (_).
            </small>
            <input type="text" className="border rounded p-2 mt-1" />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="font-semibold">* Login password</label>
            <small className="text-gray-500">
              Must contain at least one lowercase letter, one digit, and one uppercase letter.
            </small>
            <input type="password" className="border rounded p-2 mt-1" />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col">
            <label className="font-semibold">* Confirm password</label>
            <input type="password" className="border rounded p-2" />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="font-semibold">* Email address</label>
            <input type="email" className="border rounded p-2" />
          </div>

          {/* Newsletter */}
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <label>Email subscription</label>
          </div>

          {/* Country */}
          <div className="flex flex-col">
            <label className="font-semibold">* Country</label>
            <select className="border rounded p-2">
              <option>Select a country</option>
            </select>
          </div>

          {/* First Name */}
          <div className="flex flex-col">
            <label className="font-semibold">* First Name</label>
            <input className="border rounded p-2" type="text" />
          </div>

          {/* Last Name */}
          <div className="flex flex-col">
            <label className="font-semibold">* Last Name</label>
            <input className="border rounded p-2" type="text" />
          </div>

          {/* Date of Birth */}
          <div className="flex flex-col">
            <label className="font-semibold">Date of birth</label>
            <input className="border rounded p-2" type="date" />
          </div>

          {/* Address */}
          <div className="flex flex-col md:col-span-2">
            <label className="font-semibold">Address</label>
            <textarea className="border rounded p-2" rows={3}></textarea>
          </div>

          {/* Zip */}
          <div className="flex flex-col">
            <label className="font-semibold">Zip code</label>
            <input className="border rounded p-2" />
          </div>

          {/* Company */}
          <div className="flex flex-col">
            <label className="font-semibold">* Company Name</label>
            <input className="border rounded p-2" />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label className="font-semibold">* Mobile Number</label>
            <input className="border rounded p-2" />
          </div>

          {/* Telegram */}
          <div className="flex flex-col">
            <label className="font-semibold">Telegram/Teams</label>
            <input className="border rounded p-2" />
          </div>

          {/* Website URL */}
          <div className="flex flex-col">
            <label className="font-semibold">* Website URL</label>
            <input className="border rounded p-2" />
          </div>
          <br></br>

          {/* Marketing Method */}
          <div className="md:col-span-2 flex flex-col w-full">
            <label className="font-semibold">* How will you market us?</label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="market" /> Website
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="market" /> Offline
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="market" /> Email
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="market" /> Other
              </label>
            </div>
          </div>

          {/* Terms */}
          <div className="md:col-span-2 mt-4">
            <label className="font-semibold text-red-600">* Terms & Conditions</label>

            <div className="flex items-center gap-2 mt-1">
              <input type="checkbox" />
              <span>I agree to the terms and conditions</span>
            </div>
          </div>

          {/* Submit */}
          <div className="md:col-span-2 flex justify-center mt-6">
            <button
              type="submit"
              className="font-semibold bg-purple-700 hover:bg-yellow-600 text-white px-10 py-3 rounded-full"
            >
              Signup
            </button>
          </div>

          {/* Support Section */}
            <div className="md:col-span-2 mt-8 justify-start">
              <h2 className="text-xl font-semibold mb-2">Support</h2>

              <div className="flex flex-col justify-start gap-1">

                {/* Email */}
                <a
                  href="mailto:vidavegas@neataffiliates.com"
                  className="flex items-center gap-2 text-purple-700 hover:text-purple-900 text-lg font-medium"
                >
                  <span className="text-2xl">📧</span>
                  Email: vidavegas@neataffiliates.com
                </a>

              </div>
            </div>
        </form>
      </div>
    </div>
  );
};

export default VidavegasBrSignupModal;
