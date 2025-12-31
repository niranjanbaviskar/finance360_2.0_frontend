"use client";
import { useEffect, useRef, useState } from "react";
import { fetchRecentSMS } from "@/utils/api";

/**
 * Simple polling-based new message alert.
 * In production, consider WebSockets or Firestore client SDK for real-time updates.
 */
export default function SmsAlert() {
  const [show, setShow] = useState(false);
  const [latest, setLatest] = useState(null);
  const lastIdRef = useRef(null);

  useEffect(() => {
    const poll = async () => {
      try {
        const recent = await fetchRecentSMS();
        if (recent?.length) {
          const top = recent[0];
          if (lastIdRef.current && top.id !== lastIdRef.current) {
            setLatest(top);
            setShow(true);
            setTimeout(() => setShow(false), 5000);
          }
          lastIdRef.current = top.id;
        }
      } catch (e) {
        // silent
      }
    };

    // initial load
    poll();
    const t = setInterval(poll, 5000);
    return () => clearInterval(t);
  }, []);

  if (!show || !latest) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white border border-gray-200 shadow-lg rounded-2xl p-4">
      <h4 className="text-lg font-semibold text-green-700 mb-1">📩 New SMS</h4>
      <p className="text-sm text-gray-700">{latest.body}</p>
      {typeof latest.amount === "number" && (
        <p className={`text-sm mt-1 ${latest.type === "credit" ? "text-green-600" : "text-red-600"}`}>
          {latest.type === "credit" ? "+" : "-"}₹{latest.amount}
        </p>
      )}
      <p className="text-xs text-gray-500 mt-2">{latest.from}</p>
    </div>
  );
}
