// lib/apiClients.js
export async function angelRequest(path) {
  const res = await fetch(`http://localhost:4000/api/angel?type=secure&path=${encodeURIComponent(path)}`);
  return res.json();
}

export async function angelPublisherRequest(path) {
  const res = await fetch(`http://localhost:4000/api/angel?type=publisher&path=${encodeURIComponent(path)}`);
  return res.json();
}

export async function angelHistoricalRequest(path) {
  const res = await fetch(`http://localhost:4000/api/angel?type=historical&path=${encodeURIComponent(path)}`);
  return res.json();
}
