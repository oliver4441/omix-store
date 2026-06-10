// M-Pesa Callback - Vercel Serverless Function
// Receives payment confirmation from Safaricom after STK Push

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const body = req.body;
      console.log("M-Pesa Callback:", JSON.stringify(body, null, 2));

      const stkCallback = body?.Body?.stkCallback;
      const resultCode = stkCallback?.ResultCode;
      const resultDesc = stkCallback?.ResultDesc;

      const items = stkCallback?.CallbackMetadata?.Item || [];
      const metadata = {};
      items.forEach(item => {
        metadata[item.Name] = item.Value || item.Value === 0 ? String(item.Value) : "";
      });

      if (resultCode === 0) {
        console.log("✅ Payment success:", {
          transactionId: metadata["MpesaReceiptNumber"],
          amount: metadata["Amount"],
          phone: metadata["PhoneNumber"],
        });
        // TODO: Update order, send confirmation
      } else {
        console.log("❌ Payment failed:", resultDesc);
      }

      return res.json({ ResultCode: 0, ResultDesc: "Success" });
    } catch (err) {
      console.error("Callback error:", err);
      return res.json({ ResultCode: 1, ResultDesc: "Error" });
    }
  }

  // Health check
  return res.json({ status: "ok", message: "M-Pesa callback active" });
}
