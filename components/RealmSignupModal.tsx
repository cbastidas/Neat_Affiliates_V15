"use client";

// RealmSignupModal.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const RealmSignupModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [paymentMethod, setPaymentMethod] = useState<
    "bank" | "crypto" | "papel" | null
  >(null);
  const [autoInvoice, setAutoInvoice] = useState(false);

  // form state (no UI change, just wiring)
  const [form, setForm] = useState<Record<string, any>>({});
  const update = (k: string, v: any) =>
    setForm((p) => ({
      ...p,
      [k]: v,
    }));

  // derive paymentId from the single selection
  // Bank Transfer=10, Crypto=8, Papel=9
  const paymentId =
    paymentMethod === "bank"
      ? "10"
      : paymentMethod === "crypto"
      ? "8"
      : paymentMethod === "papel"
      ? "9"
      : "";

  // Realm brands from Supabase
  const [realmBrands, setRealmBrands] = useState<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchRealmBrands = async () => {
      const { data, error } = await supabase
        .from("brands")
        .select("id, name, logo_url, group, order")
        .eq("group", "Realm")
        .order("order", { ascending: true });

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
          Please fill in the form below to create your account for the brands
          shown below.
        </p>

        {/* Realm logos from Supabase */}
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
        <form
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          onSubmit={async (e) => {
            e.preventDefault();

            // minimal validation (same UX as Throne)
            if (!form.username || !form.email) {
              alert("Username and email are required.");
              return;
            }

            if (!paymentId) {
              alert("Please choose a payment method.");
              return;
            }

            // send to backend (user selects only one payment method)
            const payload = {
              ...form,

              // payment single selection -> duplicated server-side expectations
              paymentId,
              field_payment_type_id: paymentId,
              field_payment_type: paymentId,

              autoInvoice,
              instance: "Realm",
            };

            const res = await fetch("/api/realm-signup", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            const contentType = res.headers.get("content-type") || "";
            const out = contentType.includes("application/json")
              ? await res.json()
              : await res.text();

            console.log("REALM SIGNUP RESPONSE:", out);

            if (res.ok) {
              alert("Signup sent! Check console for response.");
              onClose();
            } else {
              alert("Signup failed. Check console.");
            }
          }}
        >
          {/* Login Username */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">* Login username</label>
            <input
              className="border rounded p-2"
              type="text"
              placeholder="Enter username"
              value={form.username ?? ""}
              onChange={(e) => update("username", e.target.value)}
            />
            <small>
              Please ensure your username contains only letters, numbers and
              underscores.
            </small>
          </div>

          {/* Password */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">* Login password</label>
            <input
              className="border rounded p-2"
              type="password"
              placeholder="Enter password"
              value={form.password ?? ""}
              onChange={(e) => update("password", e.target.value)}
            />
            <small>Must contain one uppercase letter and one number.</small>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">* Confirm password</label>
            <input
              className="border rounded p-2"
              type="password"
              placeholder="Confirm password"
              value={form.confirmPassword ?? ""}
              onChange={(e) => update("confirmPassword", e.target.value)}
            />
          </div>

          {/* Email */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">* Email address</label>
            <input
              className="border rounded p-2"
              type="email"
              placeholder="your@email.com"
              value={form.email ?? ""}
              onChange={(e) => update("email", e.target.value)}
            />
          </div>

          {/* Country */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">* Country</label>
            <select
              className="border rounded p-2"
              value={form.country ?? ""}
              onChange={(e) => update("country", e.target.value)}
            >
              <option value="">Select a country</option>
              <option value="MT">Malta</option>
              <option value="ES">Spain</option>
              <option value="CO">Colombia</option>
              <option value="BR">Brazil</option>
            </select>
          </div>

          {/* Newsletter */}
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              checked={!!form.emailsubscription}
              onChange={(e) => update("emailsubscription", e.target.checked)}
            />
            <label>Email subscription</label>
          </div>

          {/* First Name */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">* First Name</label>
            <input
              className="border rounded p-2"
              type="text"
              value={form.first_name ?? ""}
              onChange={(e) => update("first_name", e.target.value)}
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">* Last Name</label>
            <input
              className="border rounded p-2"
              type="text"
              value={form.last_name ?? ""}
              onChange={(e) => update("last_name", e.target.value)}
            />
          </div>

          {/* Date of birth */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">* Date of Birth</label>
            <input
              className="border rounded p-2"
              type="date"
              value={form.date_of_birth ?? ""}
              onChange={(e) => update("date_of_birth", e.target.value)}
            />
          </div>

          {/* Teams */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">Teams (Skype)</label>
            <input
              className="border rounded p-2"
              type="text"
              value={form.skype_aim ?? ""}
              onChange={(e) => update("skype_aim", e.target.value)}
            />
          </div>

          {/* Telegram */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">Telegram</label>
            <input
              className="border rounded p-2"
              type="text"
              value={form.telegram ?? ""}
              onChange={(e) => update("telegram", e.target.value)}
            />
          </div>

          {/* Street */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">Street Address</label>
            <input
              className="border rounded p-2"
              type="text"
              value={form.address ?? ""}
              onChange={(e) => update("address", e.target.value)}
            />
          </div>

          {/* City */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">City</label>
            <input
              className="border rounded p-2"
              type="text"
              value={form.city ?? ""}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>

          {/* Company */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">Company</label>
            <input
              className="border rounded p-2"
              type="text"
              value={form.company ?? ""}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">Phone</label>
            <input
              className="border rounded p-2"
              type="text"
              value={form.mobile ?? ""}
              onChange={(e) => update("mobile", e.target.value)}
            />
          </div>

          {/* Site URL */}
          <div className="flex flex-col col-span-2">
            <label className="font-semibold">* Site URL</label>
            <input
              className="border rounded p-2"
              type="text"
              value={form.website ?? ""}
              onChange={(e) => update("website", e.target.value)}
            />
          </div>

          {/* Payment Instructions */}
          <div className="col-span-2 mt-6">
            <h3 className="font-semibold mb-2 text-gray-800">
              Payment Instructions
            </h3>

            {/* Choose payment method */}
            <label className="font-semibold text-red-600">
              * Choose a payment method
            </label>

            <div className="flex flex-col gap-2 mt-2">
              {/* Bank Transfer */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "bank"}
                  onChange={() => setPaymentMethod("bank")}
                />
                Bank Transfer
              </label>

              {/* Crypto */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "crypto"}
                  onChange={() => setPaymentMethod("crypto")}
                />
                Crypto
              </label>

              {/* Papel Wallet */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "papel"}
                  onChange={() => setPaymentMethod("papel")}
                />
                Papel Wallet
              </label>
            </div>

            {/* Dynamic Payment Sections */}

            {/* BANK TRANSFER SECTION */}
            {paymentMethod === "bank" && (
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
                    <label className="font-semibold text-red-600">
                      * IBAN / Account number
                    </label>
                    <input
                      className="border rounded p-2"
                      type="text"
                      value={form.bank_accnum ?? ""}
                      onChange={(e) => update("bank_accnum", e.target.value)}
                    />
                  </div>

                  {/* Bank name */}
                  <div className="flex flex-col">
                    <label className="font-semibold">Bank Name</label>
                    <input
                      className="border rounded p-2"
                      type="text"
                      value={form.bank_name ?? ""}
                      onChange={(e) => update("bank_name", e.target.value)}
                    />
                  </div>

                  {/* Beneficiary name */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-red-600">
                      * Beneficiary name
                    </label>
                    <input
                      className="border rounded p-2"
                      type="text"
                      value={form.bank_other ?? ""}
                      onChange={(e) => update("bank_other", e.target.value)}
                    />
                  </div>

                  {/* SWIFT / BIC */}
                  <div className="flex flex-col">
                    <label className="font-semibold">SWIFT / BIC</label>
                    <input
                      className="border rounded p-2"
                      type="text"
                      value={form.bank_swift ?? ""}
                      onChange={(e) => update("bank_swift", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CRYPTO SECTION */}
            {paymentMethod === "crypto" && (
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
                    <label className="font-semibold text-red-600">
                      * Wallet Address
                    </label>
                    <input
                      className="border rounded p-2"
                      type="text"
                      value={form.crypto_wallet ?? ""}
                      onChange={(e) => update("crypto_wallet", e.target.value)}
                    />
                  </div>

                  {/* Network */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-red-600">
                      * Network (BTC, ETH, TRC20, etc.)
                    </label>
                    <input
                      className="border rounded p-2"
                      type="text"
                      value={form.crypto_method ?? ""}
                      onChange={(e) => update("crypto_method", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* PAPEL WALLET SECTION */}
            {paymentMethod === "papel" && (
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
                    <label className="font-semibold text-red-600">
                      * Account number
                    </label>
                    <input
                      className="border rounded p-2"
                      type="text"
                      value={form.papel_wallet_id ?? ""}
                      onChange={(e) => update("papel_wallet_id", e.target.value)}
                    />
                  </div>

                  {/* Affiliate name */}
                  <div className="flex flex-col">
                    <label className="font-semibold text-red-600">
                      * Affiliate name
                    </label>
                    <input
                      className="border rounded p-2"
                      type="text"
                      value={form.papel_surname ?? ""}
                      onChange={(e) => update("papel_surname", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Invoicing Options */}
          <div className="col-span-2 mt-8">
            <h3 className="font-semibold mb-2 text-gray-800">
              Invoicing Options
            </h3>

            <label className="font-semibold text-red-600">
              * Automatically generate payment invoices?
            </label>

            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                checked={autoInvoice}
                onChange={() => setAutoInvoice(!autoInvoice)}
              />
              <span className="text-sm">
                Automatically generate an invoice for each payment
              </span>
            </div>

            {/* Biller details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col md:col-span-1">
                <label className="font-semibold text-red-600">
                  * Biller details
                </label>
                <p className="text-sm text-gray-600 mb-1">
                  Invoice header example:
                  <br />
                  Affiliate Inc.
                  <br />
                  123 Example Street,
                  <br />
                  Windsor, 13345.
                  <br />
                  ABN: 123 456 789 0
                </p>
                <textarea
                  className="border rounded p-2 w-full"
                  rows={5}
                  disabled={!autoInvoice}
                  value={form.invoice_biller_details ?? ""}
                  onChange={(e) =>
                    update("invoice_biller_details", e.target.value)
                  }
                ></textarea>
              </div>

              <div className="flex flex-col md:col-span-1">
                {/* Default Tax Details */}
                <h3 className="font-semibold mb-2 text-gray-800 mt-4 md:mt-0">
                  Default tax details
                </h3>

                {/* Tax name */}
                <label className="font-semibold text-red-600">* Tax name</label>
                <select
                  className="border rounded p-2 mb-4"
                  disabled={!autoInvoice}
                  value={form.invoice_tax_type ?? ""}
                  onChange={(e) => update("invoice_tax_type", e.target.value)}
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
                    value={form.invoice_tax_rate ?? ""}
                    onChange={(e) => update("invoice_tax_rate", e.target.value)}
                  />
                  <span className="font-semibold">%</span>
                </div>

                {/* Tax note */}
                <label className="font-semibold">Tax note</label>
                <input
                  className="border rounded p-2 mb-2"
                  type="text"
                  disabled={!autoInvoice}
                  value={form.invoice_tax_note ?? ""}
                  onChange={(e) => update("invoice_tax_note", e.target.value)}
                />
                <p className="text-sm text-gray-600">
                  The tax note will appear beside the tax amount on the
                  generated invoice.
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
              <input
                type="checkbox"
                checked={!!form.termsagreement}
                onChange={(e) => update("termsagreement", e.target.checked)}
              />
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
