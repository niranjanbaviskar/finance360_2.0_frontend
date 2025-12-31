// import { NextResponse } from 'next/server';

// export async function GET(request, { params }) {
//   const ticker = params.ticker.join('.');
//   // IMPORTANT: Get the API key for your NEW provider from .env.local
//   const apiKey = process.env.YOUR_NEW_API_KEY; 

//   if (!ticker) {
//     return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 });
//   }

//   try {
//     // --- 1. REPLACE THIS SECTION ---
//     // Change the fetch URL to match your NEW API's documentation
//     const response = await fetch(`https://api.yournewprovider.com/v1/quote?symbol=${ticker}&apikey=${apiKey}`);
    
//     // --- 2. REPLACE THIS SECTION ---
//     // This part is CRITICAL. You must handle the data based on the NEW API's format.
//     const data = await response.json();

//     // Example: If your new API returns data like { name: "...", priceInfo: { current: ... } }
//     // You need to extract it correctly.
    
//     // --- Defensive Check for the new API ---
//     if (!data || data.error) { // Adjust this check based on how your new API reports errors
//       return NextResponse.json({ error: `No data found for ${ticker} from the new API.` }, { status: 404 });
//     }

//     // --- 3. REPLACE THIS SECTION ---
//     // Create the final object with the data you extracted.
//     // The goal is to create an object that your frontend components (StockInfo, InvestmentSafety) expect.
//     const stockData = {
//       overview: {
//         Name: data.companyName, // Example: Get the name from the new data format
//         Symbol: data.symbol,    // Example: Get the symbol
//         Description: data.description // Example: Get the description
//         // ... map other overview fields your frontend needs
//       },
//       quote: {
//         '05. price': data.price, // Example: Get the price
//         '09. change': data.change, // Example: Get the change
//         '10. change percent': data.changePercent // Example: Get the change percent
//         // ... map other quote fields your frontend needs
//       }
//     };

//     return NextResponse.json(stockData);

//   } catch (error) {
//     console.error(`CRITICAL ERROR for ticker [${ticker}]:`, error);
//     return NextResponse.json(
//       { error: 'An internal server error occurred. Check server logs for details.' },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const ticker = params.ticker.join('.');
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!ticker) {
    return NextResponse.json({ error: 'Ticker symbol is required' }, { status: 400 });
  }

  try {
    // Fetch data from Finnhub
    const [profileResponse, quoteResponse] = await Promise.all([
      fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`),
      fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`)
    ]);

    const profileData = await profileResponse.json();
    const quoteData = await quoteResponse.json();

    // --- DEBUGGING LOGS ---
    // This will show us exactly what Finnhub is sending back in the terminal
    console.log(`Data for ${ticker} - Profile:`, JSON.stringify(profileData, null, 2));
    console.log(`Data for ${ticker} - Quote:`, JSON.stringify(quoteData, null, 2));

    // --- More Robust Defensive Check ---
    // Checks if the profile has a name AND the quote has a valid price
    if (!profileData || !profileData.name || typeof quoteData.c !== 'number') {
      return NextResponse.json({ error: `Incomplete data found for ticker: ${ticker}` }, { status: 404 });
    }

    // MAP Finnhub's data to the format your frontend expects
    const stockData = {
      overview: {
        Name: profileData.name || 'N/A',
        Symbol: profileData.ticker || 'N/A',
        Description: `A company in the ${profileData.finnhubIndustry} industry.`,
        Exchange: profileData.exchange || 'N/A',
        Sector: profileData.finnhubIndustry || 'N/A',
        MarketCapitalization: (profileData.marketCapitalization || 0) * 1000000,
        PERatio: profileData.pe || 'N/A',
        EPS: profileData.eps || 'N/A',
        '52WeekHigh': 'N/A',
        '52WeekLow': 'N/A',
        DividendYield: profileData.dividendYield || 'N/A'
      },
      quote: {
        '05. price': quoteData.c,
        '09. change': quoteData.d,
        '10. change percent': `${quoteData.dp}%`
      }
    };

    return NextResponse.json(stockData);

  } catch (error) {
    console.error(`CRITICAL ERROR for ticker [${ticker}]:`, error);
    return NextResponse.json(
      { error: 'An internal server error occurred. Check server logs for details.' },
      { status: 500 }
    );
  }
}