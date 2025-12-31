"use client";
import { useEffect, useMemo, useState } from "react";
import { fetchSMS } from "@/utils/api";
import SmsList from "./components/SmsList";

export default function SmsPage() {
  const [messages, setMessages] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetchSMS()
      .then(setMessages)
      .catch((e) => console.error("Fetch all error:", e));
  }, []);

  const filtered = useMemo(() => {
    if (!q) return messages;
    const str = q.toLowerCase();
    return messages.filter(
      (m) =>
        m.body?.toLowerCase().includes(str) ||
        m.from?.toLowerCase().includes(str) ||
        m.type?.toLowerCase().includes(str)
    );
  }, [messages, q]);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📩 All Finance SMS</h1>

      <div className="mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="w-full md:w-96 border rounded-lg px-3 py-2"
          placeholder="Search by text, sender, or type..."
        />
      </div>

      <SmsList messages={filtered} />
    </div>
  );
}
