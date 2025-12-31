const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://<your-public-url>";

export async function fetchSMS() {
  const res = await fetch(`${API_URL}/api/sms/messages`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Error fetching messages: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export async function fetchRecentSMS() {
  const res = await fetch(`${API_URL}/api/sms/messages/recent`);
  if (!res.ok) throw new Error("Error fetching recent SMS");
  return res.json();
}
