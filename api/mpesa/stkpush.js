// M-Pesa STK Push - Vercel Serverless Function
// Fetches OAuth token, then sends STK push to Safaricom API

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET || "";
const BUSINESS_SHORTCODE = process.env.MPESA_SHORTCODE || "174379";
const PASSKEY = process.env.MPESA_PASSKEY || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://omix-store.vercel.app";

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { phone, amount, items } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ errorMessage: "Phone and amount required" });
    }

    // If API keys not configured, accept order for manual processing
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
      console.log("M-Pesa not configured. Order received:", { phone, amount, items });
      return res.json({
        ResponseCode: "0",
        ResponseDescription: "Order received. We'll contact you via WhatsApp.",
        MerchantRequestID: "MANUAL-" + Date.now(),
        CheckoutRequestID: "N/A",
      });
    }

    // Get auth token from Safaricom
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString("base64");
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );
    const { access_token } = await tokenRes.json();

    // Generate timestamp (YYYYMMDDHHmmss)
    const now = new Date();
    const ts = now.getFullYear().toString() +
      String(now.getMonth() + 1).padStart(2, "0") +
      String(now.getDate()).padStart(2, "0") +
      String(now.getHours()).padStart(2, "0") +
      String(now.getMinutes()).padStart(2, "0") +
      String(now.getSeconds()).padStart(2, "0");

    const password = Buffer.from(BUSINESS_SHORTCODE + PASSKEY + ts).toString("base64");
    const formattedPhone = phone.replace(/^0/, "254").replace(/^\+/, "");

    // STK Push
    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: BUSINESS_SHORTCODE,
          Password: password,
          Timestamp: ts,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(amount),
          PartyA: formattedPhone,
          PartyB: BUSINESS_SHORTCODE,
          PhoneNumber: formattedPhone,
          CallBackURL: `${BASE_URL}/api/mpesa/callback`,
          AccountReference: "Omix Store",
          TransactionDesc: `Payment for ${items?.length || 1} item(s)`,
        }),
      }
    );

    const data = await stkRes.json();
    return res.json(data);
  } catch (err) {
    console.error("M-Pesa error:", err);
    return res.status(500).json({ errorMessage: err.message, ResponseCode: "1" });
  }
}
