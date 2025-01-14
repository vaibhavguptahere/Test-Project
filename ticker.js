// Configuration for the ticker API
const tickerApiUrl = "https://finnhub.io/api/v1/quote?symbol="; // Replace with actual API endpoint
const tickerSymbols = ["AADI", "AAL", "ABAT", "CFG", "DRRX", "CENT", "CG", "GATO", "INCY", "INDO", "LYG", "NURO", "UBS"];
const apiKey = "cu39mspr01qure9c7mr0cu39mspr01qure9c7mrg"; // Replace with your API key

const tickerContainer = document.querySelector(".ticker");

// Function to fetch the USD to INR conversion rate
async function fetchExchangeRate() {
  try {
    const response = await fetch('https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD'); // Replace with your API key
    const data = await response.json();
    return data.conversion_rates.INR; // Extract the INR conversion rate
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    return 1; // If there's an error, return 1 (no conversion)
  }
}

// Function to fetch and update ticker data
async function updateTicker() {
  const exchangeRate = await fetchExchangeRate(); // Fetch the USD to INR rate
  try {
    const responses = await Promise.all(
      tickerSymbols.map(symbol => 
        fetch(`${tickerApiUrl}${symbol}&token=${apiKey}`).then(res => res.json())
      )
    );

    // Update ticker content with prices in USD and INR
    tickerContainer.innerHTML = responses.map((data, index) => {
      if (!data.c || !data.pc) {
        return `<span>${tickerSymbols[index]}: Data unavailable</span>`;
      }
      const symbol = tickerSymbols[index];
      const changeClass = data.c > data.pc ? "up" : "down";
      
      // Convert the current price and previous close from USD to INR
      const priceInINR = (data.c * exchangeRate).toFixed(2); // Convert current price to INR
      const previousCloseInINR = (data.pc * exchangeRate).toFixed(2); // Convert previous close to INR
      const priceInUSD = data.c.toFixed(2); // Price in USD
      const previousCloseInUSD = data.pc.toFixed(2); // Previous close in USD
      const changePercentage = ((data.c - data.pc) / data.pc * 100).toFixed(2);

      return `
        <span>${symbol} &nbsp; 
          <span>$${priceInUSD}</span> 
          <span class="${changeClass}">${data.c > data.pc ? "▲" : "▼"} ${changePercentage}%</span> 
        &nbsp; </span>`;
    }).join("");
  } catch (error) {
    console.error("Error updating ticker:", error);
    tickerContainer.innerHTML = "<span>Error loading ticker data.</span>";
  }
}

// Auto-update ticker every 10 minutes
updateTicker();
setInterval(updateTicker, 1000000);
