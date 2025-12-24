export const runtime = "nodejs";

import { NextResponse } from "next/server";

const FEED_URL = process.env.MA_REALM_FEED_URL!;
const FEED_USER = process.env.MA_FEED_USER!;
const FEED_PASS = process.env.MA_FEED_PASS!;

function append(params: URLSearchParams, key: string, value: any) {
  params.append(key, value === undefined || value === null ? "" : String(value));
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const paymentId = String(
      body.paymentId ??
      body.field_payment_type_id ??
      ""
    );

    if (!body.username || !body.email) {
      return NextResponse.json(
        { ok: false, error: "username and email are required" },
        { status: 400 }
      );
    }

    if (!paymentId) {
      return NextResponse.json(
        { ok: false, error: "paymentId is required" },
        { status: 400 }
      );
    }

    // FEED expects PARAM_ for core fields (based on your earlier feed errors)
    const params = new URLSearchParams();

    append(params, "account_type", "shell");
    append(params, "PARAM_username", body.username);
    append(params, "PARAM_password", body.password);
    append(params, "PARAM_confirmPassword", body.confirmPassword);
    append(params, "PARAM_email", body.email);
    append(params, "PARAM_country", body.country || "MT");

    // optional profile fields
    append(params, "PARAM_first_name", body.first_name);
    append(params, "PARAM_last_name", body.last_name);
    append(params, "PARAM_mobile", body.mobile);
    append(params, "PARAM_skype_aim", body.skype_aim);
    append(params, "PARAM_telegram", body.telegram);
    append(params, "PARAM_company", body.company);
    append(params, "PARAM_website", body.website);
    append(params, "PARAM_address", body.address);
    append(params, "PARAM_city", body.city);
    append(params, "PARAM_zip", body.postcode);
    append(params, "PARAM_date_of_birth", body.date_of_birth);

    append(params, "PARAM_agreement", body.termsagreement ? "1" : "0");
    append(params, "PARAM_emailsubscription", body.emailsubscription ? "1" : "0");

    // ✅ send BOTH: thresholds + profile (same value)
    append(params, "PARAM_field_payment_type_id", paymentId);
    append(params, "PARAM_field_payment_type", paymentId);

    // ✅ payment details in “form-style arrays” (as you confirmed)
    append(params, "jetbahis_email[5][]", body.jetbahis_email ?? ""); // harmless if empty
    append(params, "crypto_method[8][]", body.crypto_method ?? "");
    append(params, "crypto_wallet[8][]", body.crypto_wallet ?? "");
    append(params, "crypto_surname[8][]", body.crypto_surname ?? "");
    append(params, "papel_surname[9][]", body.papel_surname ?? "");
    append(params, "papel_wallet_id[9][]", body.papel_wallet_id ?? "");
    append(params, "bank_accnum[10][]", body.bank_accnum ?? "");
    append(params, "bank_city[10][]", body.bank_city ?? "");
    append(params, "bank_country[10][]", body.bank_country ?? "");
    append(params, "bank_iban[10][]", body.bank_iban ?? "");
    append(params, "bank_name[10][]", body.bank_name ?? "");
    append(params, "bank_other[10][]", body.bank_other ?? "");
    append(params, "bank_street[10][]", body.bank_street ?? "");
    append(params, "bank_swift[10][]", body.bank_swift ?? "");
    append(params, "bank_zip[10][]", body.bank_zip ?? "");

    // invoicing (keep keys, empty allowed)
    append(params, "invoice_biller_details", body.invoice_biller_details ?? "");
    append(params, "invoice_tax_type", body.invoice_tax_type ?? "");
    append(params, "invoice_tax_rate", body.invoice_tax_rate ?? "");
    append(params, "invoice_tax_note", body.invoice_tax_note ?? "");

    const maRes = await fetch(FEED_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + Buffer.from(`${FEED_USER}:${FEED_PASS}`).toString("base64"),
      },
      body: params.toString(),
    });

    const text = await maRes.text();

    // return raw XML/text so you can debug immediately
    return new NextResponse(text, {
      status: maRes.ok ? 200 : 400,
      headers: { "Content-Type": maRes.headers.get("content-type") ?? "text/plain" },
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
