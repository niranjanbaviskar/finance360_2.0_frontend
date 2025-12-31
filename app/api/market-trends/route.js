// import { NextResponse } from 'next/server';

// export async function GET() {
//   const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

//   try {
//     const response = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`);
//     const data = await response.json();

//     if (data.Note) {
//       return NextResponse.json({ error: 'API call limit reached for market trends.' }, { status: 429 });
//     }

//     return NextResponse.json(data);

//   } catch (error) {
//     console.error('Market Trends API error:', error);
//     return NextResponse.json({ error: 'Failed to fetch market trends' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

const SYMBOLS_TO_TRACK = ['SPY', 'DIA', 'AAPL', 'MSFT', 'GOOGL', 'NVDA'];

export async function GET() {
  const apiKey = process.env.FINNHUB_API_KEY;

  try {
    const promises = SYMBOLS_TO_TRACK.map(symbol =>
      fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`)
        .then(res => res.json())
        .then(data => ({ ...data, symbol })) // Add symbol to the result
    );

    const results = await Promise.all(promises);

    const formattedData = results
      .filter(quote => quote && quote.c !== 0)
      .map(quote => ({
          symbol: quote.symbol,
          price: quote.c.toFixed(2),
          change: quote.d.toFixed(2),
          change_percent: quote.dp.toFixed(2) + '%'
      }));

    return NextResponse.json(formattedData);

  } catch (error) {
    console.error('Market Trends API error:', error);
    return NextResponse.json({ error: 'Failed to fetch market data' }, { status: 500 });
  }
}