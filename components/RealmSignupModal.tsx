// RealmSignupModal.tsx
import React, { useState, useEffect } from 'react'; // 🔹 NEW: added useEffect
import { supabase } from './lib/supabaseClient';    // 🔹 NEW: import supabase

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const RealmSignupModal: React.FC<Props> = ({ isOpen, onClose }) => {
const [paymentMethod, setPaymentMethod] = useState<'bank' | 'crypto' | 'papel' | null>(null);
const [autoInvoice, setAutoInvoice] = useState(false);

// 🔹 NEW: state to store Realm brands
const [realmBrands, setRealmBrands] = useState<any[]>([]);

// 🔹 NEW: load Realm brands from Supabase when the modal opens
useEffect(() => {
  if (!isOpen) return;

  const fetchRealmBrands = async () => {
    const { data, error } = await supabase
      .from('brands')
      .select('id, name, logo_url, group, order')
      .eq('group', 'Realm')
      .order('order', { ascending: true });

    if (!error && data) {
      setRealmBrands(data);
    }
  };

  fetchRealmBrands();
}, [isOpen]);

  // Close modal on ESC key
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
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={(e) => {
            // Close only when clicking background, not the modal content
            if (e.target === e.currentTarget) onClose();
          }}
        >
            {/* Modal Container */}
            <div
                className="
                  bg-white 
                  w-[95%] max-w-4xl max-h-[90vh] 
                  overflow-y-auto 
                  rounded-2xl 
                  shadow-xl 
                  p-6 
                  md:p-8 
                  relative 
                  overflow-x-hidden 
                  box-border
                "
                style={{ minWidth: 0 }}
              >

                {/* Close button */}
                <button 
                    className="absolute top-4 right-4 text-black text-2xl"
                    onClick={onClose}
                >
                    ×
                </button>

                {/* Modal Title */}
                <h2 className="text-center text-3xl font-semibold mb-6">
                    Create Your Affiliate Account
                </h2>

                <p className="text-center text-gray-600 mb-8">
                    Please fill in the form below to create your account for the brands shown below.
                </p>

                {/* 🔹 NEW: Realm logos from Supabase */}
                <div className="w-full flex flex-wrap justify-center gap-4 md:gap-6 mt-4 mb-8">
                  {realmBrands.map((brand) => (
                      <img
                        key={brand.id}
                        src={brand.logo_url}
                        alt={brand.name}
                        className="h-10 md:h-12 w-auto object-contain flex-shrink-0"
                      />
                  ))}
                </div>

                {/* FORM START */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Login Username */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">
                            * Login username
                        </label>
                        <input 
                            className="border rounded p-2"
                            type="text"
                            placeholder="Enter username"
                        />
                        <small>
                            Please ensure your username contains only letters, numbers and underscores.
                        </small>
                    </div>

                    {/* Password */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">
                            * Login password
                        </label>
                        <input 
                            className="border rounded p-2"
                            type="password"
                            placeholder="Enter password"
                        />
                        <small>
                            Must contain one uppercase letter and one number.
                        </small>
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">
                            * Confirm password
                        </label>
                        <input 
                            className="border rounded p-2"
                            type="password"
                            placeholder="Confirm password"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Email address</label>
                        <input 
                            className="border rounded p-2"
                            type="email"
                            placeholder="your@email.com"
                        />
                    </div>

                    {/* Country */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Country</label>
                        <select className="border rounded p-2">
                            <option value="">Select a country</option>
                            <option>Malta</option>
                            <option>Spain</option>
                            <option>Colombia</option>
                            <option>Brazil</option>
                        </select>
                    </div>

                    {/* Newsletter */}
                    <div className="flex items-center gap-2 mt-6">
                        <input type="checkbox" />
                        <label>Email subscription</label>
                    </div>

                    {/* First Name */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* First Name</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    {/* Last Name */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Last Name</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    {/* Date of birth */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Date of Birth</label>
                        <input className="border rounded p-2" type="date" />
                    </div>

                    {/* Teams */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Teams (Skype)</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    {/* Telegram */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Telegram</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    {/* Street */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Street Address</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    {/* City */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">City</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    {/* Company */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Company</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">Phone</label>
                        <input className="border rounded p-2" type="text" />
                    </div>

                    {/* Site URL */}
                    <div className="flex flex-col col-span-2">
                        <label className="font-semibold">* Site URL</label>
                        <input className="border rounded p-2" type="text" />
                    </div>


                    {/* Payment Instructions */}
                    <div className="col-span-2 mt-6">

                      <h3 className="font-semibold mb-2 text-gray-800">Payment Instructions</h3>

                      {/* Choose payment method */}
                      <label className="font-semibold text-red-600">* Choose a payment method</label>

                      <div className="flex flex-col gap-2 mt-2">

                        {/* Bank Transfer */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'bank'}
                            onChange={() => setPaymentMethod('bank')}
                          />
                          Bank Transfer
                        </label>

                        {/* Crypto */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'crypto'}
                            onChange={() => setPaymentMethod('crypto')}
                          />
                          Crypto
                        </label>

                        {/* Papel Wallet */}
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === 'papel'}
                            onChange={() => setPaymentMethod('papel')}
                          />
                          Papel Wallet
                        </label>
                      </div>

                      {/* Dynamic Payment Sections */}

                      {/* ------------------------------------------------------------------ */}
                      {/* BANK TRANSFER SECTION */}
                      {/* ------------------------------------------------------------------ */}
                      {paymentMethod === 'bank' && (
                        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                          <h4 className="font-semibold text-gray-700 mb-1">
                            Bank Transfer payment details
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Please insert all the necessary information
                          </p>
                    
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                            {/* IBAN / Account number */}
                            <div className="flex flex-col">
                              <label className="font-semibold text-red-600">* IBAN / Account number</label>
                              <input className="border rounded p-2" type="text" />
                            </div>
                    
                            {/* Bank name */}
                            <div className="flex flex-col">
                              <label className="font-semibold">Bank Name</label>
                              <input className="border rounded p-2" type="text" />
                            </div>
                    
                            {/* Beneficiary name */}
                            <div className="flex flex-col">
                              <label className="font-semibold text-red-600">* Beneficiary name</label>
                              <input className="border rounded p-2" type="text" />
                            </div>
                    
                            {/* SWIFT / BIC */}
                            <div className="flex flex-col">
                              <label className="font-semibold">SWIFT / BIC</label>
                              <input className="border rounded p-2" type="text" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ------------------------------------------------------------------ */}
                      {/* CRYPTO SECTION */}
                      {/* ------------------------------------------------------------------ */}
                      {paymentMethod === 'crypto' && (
                        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                          <h4 className="font-semibold text-gray-700 mb-1">
                            Crypto payment details
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Please enter your wallet information
                          </p>
                    
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                            {/* Wallet Address */}
                            <div className="flex flex-col">
                              <label className="font-semibold text-red-600">* Wallet Address</label>
                              <input className="border rounded p-2" type="text" />
                            </div>
                    
                            {/* Network */}
                            <div className="flex flex-col">
                              <label className="font-semibold text-red-600">* Network (BTC, ETH, TRC20, etc.)</label>
                              <input className="border rounded p-2" type="text" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* ------------------------------------------------------------------ */}
                      {/* PAPEL WALLET SECTION */}
                      {/* ------------------------------------------------------------------ */}
                      {paymentMethod === 'papel' && (
                        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                          <h4 className="font-semibold text-gray-700 mb-1">
                            Papel Wallet payment details
                          </h4>
                          <p className="text-sm text-gray-600 mb-4">
                            Please enter valid Papel wallet details
                          </p>
                    
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                            {/* Account number */}
                            <div className="flex flex-col">
                              <label className="font-semibold text-red-600">* Account number</label>
                              <input className="border rounded p-2" type="text" />
                            </div>
                    
                            {/* Affiliate name */}
                            <div className="flex flex-col">
                              <label className="font-semibold text-red-600">* Affiliate name</label>
                              <input className="border rounded p-2" type="text" />
                            </div>
                    
                          </div>
                        </div>
                      )}

                    </div>


                     {/* Invoicing Options */}
                    <div className="col-span-2 mt-8">
                                    
                      <h3 className="font-semibold mb-2 text-gray-800">Invoicing Options</h3>
                                    
                      <label className="font-semibold text-red-600">* Automatically generate payment invoices?</label>
                                    
                      <div className="flex items-center gap-2 mt-2">
                        <input 
                          type="checkbox"
                          checked={autoInvoice}
                          onChange={() => setAutoInvoice(!autoInvoice)}
                        />
                        <span className="text-sm">Automatically generate an invoice for each payment</span>
                      </div>
                                    
                      {/* Biller details */}
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    
                        <div className="flex flex-col md:col-span-1">
                          <label className="font-semibold text-red-600">* Biller details</label>
                          <p className="text-sm text-gray-600 mb-1">
                            Invoice header example:<br/>
                            Affiliate Inc.<br/>
                            123 Example Street,<br/>
                            Windsor, 13345.<br/>
                            ABN: 123 456 789 0
                          </p>
                          <textarea 
                            className="border rounded p-2 w-full"
                            rows={5}
                            disabled={!autoInvoice}
                          ></textarea>
                        </div>
                                    
                        <div className="flex flex-col md:col-span-1">
                                    
                          {/* Default Tax Details */}
                          <h3 className="font-semibold mb-2 text-gray-800 mt-4 md:mt-0">Default tax details</h3>
                                    
                          {/* Tax name */}
                          <label className="font-semibold text-red-600">* Tax name</label>
                          <select 
                            className="border rounded p-2 mb-4"
                            disabled={!autoInvoice}
                          >
                            <option value="">Select</option>
                            <option value="IVA">IVA</option>
                            <option value="GST">GST</option>
                            <option value="VAT">VAT</option>
                          </select>
                                    
                          {/* Tax rate */}
                          <label className="font-semibold text-red-600">* Tax rate</label>
                          <div className="flex items-center gap-2 mb-4">
                            <input 
                              type="number" 
                              className="border rounded p-2 w-full"
                              placeholder="0–100"
                              disabled={!autoInvoice}
                            />
                            <span className="font-semibold">%</span>
                          </div>
                                    
                          {/* Tax note */}
                          <label className="font-semibold">Tax note</label>
                          <input 
                            className="border rounded p-2 mb-2"
                            type="text"
                            disabled={!autoInvoice}
                          />
                          <p className="text-sm text-gray-600">
                            The tax note will appear beside the tax amount on the generated invoice.
                          </p>
                                    
                        </div>
                      </div>
                    </div>

                                       {/* Terms of Use */}
                    <div className="col-span-2 mt-4">
                      <label className="font-semibold text-red-600">* Terms of use</label>
                      <p className="text-sm text-gray-600">
                        Please read the{" "}
                        <a 
                          href="https://example.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-purple-600 underline hover:text-purple-800"
                        >
                          Terms of Use
                        </a>{" "}
                        before agreeing.
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" />
                        <label className="text-sm">
                          I agree with the NeatAffiliates{" "}
                          <a
                            href="https://example.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 underline hover:text-purple-800"
                          >
                            Terms of Use
                          </a>
                        </label>
                      </div>
                    </div>


                    {/* Submit */}
                    <div className="col-span-2 mt-6 flex justify-center">
                        <button 
                            type="submit"
                            className="font-semibold bg-purple-700 hover:bg-purple-800 text-white px-10 py-3 rounded-full"
                        >
                            Signup
                        </button>
                    </div>

                {/* Support Section */}
                <div className="md:col-span-2 mt-10">
                  <h3 className="text-xl font-semibold mb-4 text-center">Support</h3>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                    {/* Telegram */}
                    <a
                      href="https://t.me/neat_affiliates"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-purple-700 hover:text-purple-900 text-lg font-medium"
                    >
                      <span className="text-2xl">📨</span>
                      Telegram: @neat_affiliates
                    </a>

                    {/* Email */}
                    <a
                      href="mailto:support@neataffiliates.com"
                      className="flex items-center gap-2 text-purple-700 hover:text-purple-900 text-lg font-medium"
                    >
                      <span className="text-2xl">📧</span>
                      Email: support@neataffiliates.com
                    </a>

                  </div>
                </div>

                </form>
                {/* FORM END */}
            </div>
        </div>
    );
};

export default RealmSignupModal;
