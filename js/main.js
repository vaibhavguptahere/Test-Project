const apiKey = 'LMUYAP0I70IW975P';  // Replace with your Alpha Vantage API key
const stocks = ['RELIANCE.BSE', 'TCS.BSE', 'INFY.BSE', 'HDFCBANK.BSE'];  // Indian stock symbols

function fetchStockData() {
    stocks.forEach(stock => {
        $.get(`https://www.alphavantage.co/query`, {
            function: 'TIME_SERIES_INTRADAY',
            symbol: stock,
            interval: '1s',
            apikey: apiKey
        })
        .done(function(response) {
            const latestData = response['Time Series (5min)'];
            const latestTimestamp = Object.keys(latestData)[0];
            const stockPrice = latestData[latestTimestamp]['4. close'];
            displayStockData(stock, stockPrice);
        })
        .fail(function() {
            alert('Error fetching stock data.');
        });
    });
}

function displayStockData(stock, price) {
    const stockCard = `
        <div class="stock-card">
            <h3>${stock}</h3>
            <p><strong>Price:</strong> ₹${price}</p>
        </div>
    `;
    $('#stockContainer').append(stockCard);
}

// Fetch stock data on load
$(document).ready(function() {
    fetchStockData();
    setInterval(fetchStockData, 60000); // Refresh data every 60 seconds
});