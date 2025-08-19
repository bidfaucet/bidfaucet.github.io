// wd.js
document.getElementById("claimForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const coin = document.getElementById("coin").value;
  const resultDiv = document.getElementById("result");

  // contoh reward fixed = 1 satoshi
  const rewardBTC = 0.00000001; 

  try {
    const prices = await getPrices();

    const btcPrice = prices.bitcoin.usd;
    const rewardUSD = rewardBTC * btcPrice;

    // mapping id coingecko ke simbol faucetpay
    const mapping = {
      BTC: "bitcoin",
      ETH: "ethereum",
      DOGE: "dogecoin",
      LTC: "litecoin",
      BCH: "bitcoin-cash",
      DASH: "dash",
      DGB: "digibyte",
      TRX: "tron",
      USDT: "tether",
      FEY: "feyorra",
      ZEC: "zcash",
      BNB: "binancecoin",
      SOL: "solana",
      XRP: "ripple",
      POL: "polygon",
      ADA: "cardano",
      TON: "toncoin",
      XLM: "stellar",
      USDC: "usd-coin",
      XMR: "monero",
      TARA: "taraxa",
      TRUMP: "official-trump",
      PEPE: "pepe"
    };

    const coinId = mapping[coin];
    const coinPrice = prices[coinId].usd;

    const rewardCoin = rewardUSD / coinPrice;

    // tampilkan hasil estimasi
    resultDiv.innerHTML = `✅ Kamu dapat ${rewardCoin.toFixed(8)} ${coin}`;

    // kirim ke FaucetPay API
    const apiKey = "API_KEY_KAMU"; // ganti dengan API key
    const fpRes = await fetch("https://faucetpay.io/api/v1/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        currency: coin,
        amount: rewardCoin,
        to: email
      })
    });

    const data = await fpRes.json();
    console.log(data);

    if (data.status === 200) {
      resultDiv.innerHTML += `<br>✅ Withdraw sukses ke FaucetPay!`;
    } else {
      resultDiv.innerHTML += `<br>❌ Gagal: ${data.message}`;
    }

  } catch (err) {
    resultDiv.innerHTML = "❌ Error: " + err.message;
  }
});
