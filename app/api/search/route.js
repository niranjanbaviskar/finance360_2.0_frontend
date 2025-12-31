// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   // Get the search keywords from the URL (e.g., /api/search?query=hdfc)
//   const { searchParams } = new URL(request.url);
//   const query = searchParams.get('query');
  
//   const apiKey = process.env.ALPHA_VANTAGE_API_KEY;

//   if (!query) {
//     return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
//   }

//   try {
//     const response = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=${apiKey}`);
//     const data = await response.json();

//     // The search results are in the 'bestMatches' array
//     const searchResults = data.bestMatches || [];

//     return NextResponse.json(searchResults);

//   } catch (error) {
//     console.error('Search API error:', error);
//     return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');
  const apiKey = process.env.FINNHUB_API_KEY;

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://finnhub.io/api/v1/search?q=${query}&token=${apiKey}`);
    const data = await response.json();

    // MAP Finnhub's search results to the format your frontend expects
    const formattedResults = data.result?.map(item => ({
      '1. symbol': item.symbol,
      '2. name': item.description,
    })) || [];

    return NextResponse.json(formattedResults);

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Failed to fetch search results' }, { status: 500 });
  }
}