"use client";
import SmsCard from "./SmsCard";

export default function SmsList({ messages }) {
  if (!messages || messages.length === 0) {
    return <p className="text-gray-500">No messages found.</p>;
  }

  return (
    <div className="grid gap-3">
      {messages.map((m) => (
        <SmsCard key={m.id} sms={m} />
      ))}
    </div>
  );
}
