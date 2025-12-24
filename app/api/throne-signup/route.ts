export const runtime = "nodejs";

import { NextResponse } from "next/server";
import axios from "axios";

const API_URL = "https://admin2.neataffiliates.com/feeds.php?FEED_ID=26";
const API_USERNAME = "signupapi";
const API_PASSWORD = "J8az&X(4IkuUaOS!8p3R";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const paymentId = body.field_payment_type_id ?? body.paymentId ?? null;

    const formData = new URLSearchParams({
      account_type: "shell",

      // REQUIRED
      PARAM_username: body.username ?? "",
      PARAM_password: body.password ?? "",
      PARAM_confirmPassword: body.confirmPassword ?? "",
      PARAM_email: body.email ?? "",
      PARAM_country: body.country || "MT",

      // DETAILS
      PARAM_first_name: body.first_name ?? "",
      PARAM_last_name: body.last_name ?? "",
      PARAM_mobile: body.mobile ?? "",
      PARAM_agreement: body.termsagreement ? "1" : "0",

      // ✅ FIX: modal sends `address`, not `street_address`
      PARAM_address: body.address || body.street_address || "",
      PARAM_city: body.city ?? "",
      PARAM_zip: body.postcode ?? "",

      PARAM_company: body.company ?? "",
      PARAM_website: body.website ?? "",
      PARAM_skype_aim: body.skype_aim ?? "",
      PARAM_telegram: body.telegram ?? "",
      PARAM_date_of_birth: body.date_of_birth ?? "",
      PARAM_emailsubscription: body.emailsubscription ? "1" : "0",

      // ✅ payment thresholds
      PARAM_field_payment_type_id: paymentId ?? "",

      // ✅ ALSO send the profile payment_type (duplicate)
      PARAM_field_payment_type: paymentId ?? "",

      // Payment details (si tu feed los espera “form-style”, esto habría que cambiar,
      // pero dejamos como está tu route actual)
      PARAM_jetbahis_email: body.jetbahis_email ?? "",
      PARAM_crypto_method: body.crypto_method ?? "",
      PARAM_crypto_wallet: body.crypto_wallet ?? "",
      PARAM_crypto_surname: body.crypto_surname ?? "",
      PARAM_papel_surname: body.papel_surname ?? "",
      PARAM_papel_wallet_id: body.papel_wallet_id ?? "",

      PARAM_bank_accnum: body.bank_accnum ?? "",
      PARAM_bank_city: body.bank_city ?? "",
      PARAM_bank_country: body.bank_country ?? "",
      PARAM_bank_iban: body.bank_iban ?? "",
      PARAM_bank_name: body.bank_name ?? "",
      PARAM_bank_other: body.bank_other ?? "",
      PARAM_bank_street: body.bank_street ?? "",
      PARAM_bank_swift: body.bank_swift ?? "",
      PARAM_bank_zip: body.bank_zip ?? "",

      PARAM_invoice_biller_details: body.invoice_biller_details ?? "",
      PARAM_invoice_tax_type: body.invoice_tax_type ?? "",
      PARAM_invoice_tax_rate: body.invoice_tax_rate ?? "",
      PARAM_invoice_tax_note: body.invoice_tax_note ?? "",
    });

    const response = await axios.post(API_URL, formData.toString(), {
      auth: { username: API_USERNAME, password: API_PASSWORD },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Devuelve XML crudo para debug
    return NextResponse.json({ ok: true, response: response.data });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err.response?.data || err.message },
      { status: 500 }
    );
  }
}
