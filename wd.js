// wd.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to_address, amount, currency } = req.body;

    // Panggil API FaucetPay
    const response = await fetch("https://faucetpay.io/api/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: process.env.FAUCETPAY_API_KEY, // ambil dari .env
        to: to_address,
        amount: amount,
        currency: currency,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
