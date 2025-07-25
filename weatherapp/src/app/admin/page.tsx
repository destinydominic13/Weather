"use client";
import { useState } from "react";

export default function AdminWeather() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const sendUpdates = async () => {
    setLoading(true);
    setStatus("Sending weather updates...");

    const res = await fetch("/api/sendUpdates", {
      method: "POST",
    });

    const data = await res.json();
    setLoading(false);

    if (data.success) {
      setStatus(`✅ Sent weather updates to ${data.results.length} users.`);
    } else {
      setStatus("❌ Failed to send updates.");
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 text-center">
      <h1 className="text-2xl font-bold mb-4 text-black">Admin: Send Weather Updates</h1>
      <button
        onClick={sendUpdates}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Updates"}
      </button>
      <p className="mt-4 text-gray-700">{status}</p>
    </div>
  );
}
