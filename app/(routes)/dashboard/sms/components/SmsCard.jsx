"use client";

export default function SmsCard({ sms }) {
  const dt = sms.createdAt ? new Date(sms.createdAt) : null;
  return (
    <div className="p-4 border rounded-lg shadow bg-white">
      <div className="flex justify-between items-center">
        <p className="font-semibold">
          {sms.type === "credit" ? "💰 Credit" : sms.type === "debit" ? "🛒 Debit" : "ℹ️ Info"}
        </p>
        {typeof sms.amount === "number" && (
          <p className={`font-bold ${sms.type === "credit" ? "text-green-600" : "text-red-600"}`}>
            ₹{sms.amount}
          </p>
        )}
      </div>
      <p className="text-gray-700 mt-2">{sms.body}</p>
      <div className="text-xs text-gray-500 mt-2">
        From: {sms.from || "Unknown"} {dt ? `• ${dt.toLocaleString()}` : ""}
      </div>
    </div>
  );
}
