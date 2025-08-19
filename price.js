// price.js
async function getPrices() {
  const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin,litecoin,bitcoin-cash,dash,digibyte,tron,tether,feyorra,zcash,binancecoin,solana,ripple,polygon,cardano,toncoin,stellar,usd-coin,monero,taraxa,official-trump,pepe&vs_currencies=usd";
  const res = await fetch(url);
  return await res.json();
}
