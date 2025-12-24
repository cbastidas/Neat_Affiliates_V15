// app/api/realm-signup/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";

/**
 * Realm signup route -> MyAffiliates FEED
 *
 * Expects JSON from frontend (RealmSignupModal) with at least:
 * - username, email, password, confirmPassword
 * - paymentId (or field_payment_type_id)
 *
 * This route:
 * - Sends core fields as FEED-style PARAM_*
 * - Sends payment details in "form-style" arrays: jetbahis_email[5][], crypto_wallet[8][], bank_zip[10][], etc.
 * - Duplicates payment selection into BOTH:
 *   PARAM_field_payment_type_id  = <paymentId>
 *   PARAM_field_payment_type     = <paymentId>
 *
 * Env vars required (set in Vercel Project Settings -> Environment Variables):
 * - MA_REALM_FEED_URL   (e.g. https://admin.YOURDOMAIN.com/feeds.php?FEED_ID=XX)
 * - MA_FEED_USER
 * - MA_FEED_PASS
 */

const FEED_URL = process.env.MA_REALM_FEED_URL;
const FEED_USER = process.env.MA_FEED_USER;
const FEED_PASS = process.env.MA_FEED_PASS;

function append(params: URLSearchParams, key: string, value: any) {
  params.append(key, value === undefined || value === null ? "" : String(value));
}

export async function POST(req: Request) {
  try {
    // Guard: env vars
    if (!FEED_URL || !FEED_USER || !FEED_PASS) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Missing env vars. Need MA_REALM_FEED_URL, MA_FEED_USER, MA_FEED_PASS",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Guard: required user fields
    const username = body.username ?? body.signup_username ?? "";
    const email = body.email ?? "";
    const password = body.password ?? "";
    const confirmPassword = body.confirmPassword ?? body.passwordconf ?? "";

    if (!username || !email) {
      return NextResponse.json(
        { ok: false, error: "username and email are required" },
        { status: 400 }
      );
    }

    // Payment ID: user selects ONE method, we duplicate it in backend
    const paymentId = String(
      body.paymentId ?? body.field_payment_type_id ?? body.paymentType ?? ""
    );

    if (!paymentId || paymentId === "null" || paymentId === "undefined") {
      return NextResponse.json(
        { ok: false, error: "paymentId is required (e.g. 5, 8, 9, 10)" },
        { status: 400 }
      );
    }

    // Build form-urlencoded payload
    const params = new URLSearchParams();

    // FEED shell mode
    append(params, "account_type", "shell");

    // Core FEED fields (important: FEED wants PARAM_* here)
    append(params, "PARAM_username", username);
    append(params, "PARAM_password", password);
    append(params, "PARAM_confirmPassword", confirmPassword);
    append(params, "PARAM_email", email);
    append(params, "PARAM_country", body.country || "MT");
    append(params, "PARAM_language", body.language ?? "0");

    // Profile / details (FEED style)
    append(params, "PARAM_first_name", body.first_name ?? "");
    append(params, "PARAM_last_name", body.last_name ?? "");
    append(params, "PARAM_date_of_birth", body.date_of_birth ?? "");
    append(params, "PARAM_address", body.address ?? body.street_address ?? "");
    append(params, "PARAM_city", body.city ?? "");
    append(params, "PARAM_zip", body.postcode ?? body.zip ?? "");
    append(params, "PARAM_company", body.company ?? "");
    append(params, "PARAM_mobile", body.mobile ?? "");
    append(params, "PARAM_skype_aim", body.skype_aim ?? "");
    append(params, "PARAM_telegram", body.telegram ?? "");
    append(params, "PARAM_website", body.website ?? "");

    // Agreements
    append(params, "PARAM_agreement", body.termsagreement ? "1" : "0");
    append(params, "PARAM_emailsubscription", body.emailsubscription ? "1" : "0");

    // ✅ Payment selection duplicated (your requirement)
    append(params, "PARAM_field_payment_type_id", paymentId);
    append(params, "PARAM_field_payment_type", paymentId);

    // ✅ Payment details (FORM-STYLE arrays; your feed is configured like this)
    // Keep them always present (empty allowed), just like your working example.

    // Jetbahis (5)
    append(params, "jetbahis_email[5][]", body.jetbahis_email ?? "");

    // Crypto (8)
    append(params, "crypto_method[8][]", body.crypto_method ?? "");
    append(params, "crypto_wallet[8][]", body.crypto_wallet ?? "");
    append(params, "crypto_surname[8][]", body.crypto_surname ?? "");

    // Papel (9)
    append(params, "papel_surname[9][]", body.papel_surname ?? "");
    append(params, "papel_wallet_id[9][]", body.papel_wallet_id ?? "");

    // Bank (10)
    append(params, "bank_accnum[10][]", body.bank_accnum ?? body.bank_account ?? "");
    append(params, "bank_city[10][]", body.bank_city ?? "");
    append(params, "bank_country[10][]", body.bank_country ?? "");
    append(params, "bank_iban[10][]", body.bank_iban ?? "");
    append(params, "bank_name[10][]", body.bank_name ?? "");
    append(params, "bank_other[10][]", body.bank_other ?? "");
    append(params, "bank_street[10][]", body.bank_street ?? "");
    append(params, "bank_swift[10][]", body.bank_swift ?? "");
    append(params, "bank_zip[10][]", body.bank_zip ?? "");

    // Invoicing (FORM-STYLE like your working payload)
    append(params, "invoice_biller_details", body.invoice_biller_details ?? "");
    append(params, "invoice_tax_type", body.invoice_tax_type ?? "");
    append(params, "invoice_tax_rate", body.invoice_tax_rate ?? "");
    append(params, "invoice_tax_note", body.invoice_tax_note ?? "");

    // Auth header (Node runtime)
    const authHeader =
      "Basic " + Buffer.from(`${FEED_USER}:${FEED_PASS}`).toString("base64");

    const maRes = await fetch(FEED_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authHeader,
      },
      body: params.toString(),
    });

    const text = await maRes.text();

    // Return raw response (usually XML) for debugging in the browser console
    return new NextResponse(text, {
      status: maRes.ok ? 200 : 400,
      headers: {
        "Content-Type": maRes.headers.get("content-type") ?? "text/plain",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
