"use client";
import { useState } from "react";

export default function SmsSubscribeForm() {
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [status, setStatus] = useState("");

  const subscribe = async () => {
    if (!phone || !city) {
      setStatus("⚠️ Please enter both phone and city.");
      return;
    }

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ phoneNumber: phone, city }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Subscribed successfully!");
        setPhone("");
        setCity("");
      } else {
        setStatus("❌ Failed to subscribe.");
      }
    } catch (err) {
      setStatus("🚨 Error connecting to the server.");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h3 className="text-lg font-bold mb-4 text-center">Get SMS Weather Alerts</h3>
      <input
        type="text"
        placeholder="Phone Number (e.g. +234...)"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-2 mb-3 border rounded outline-none focus:ring-2 focus:ring-blue-300"
      />
      <input
        type="text"
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full p-2 mb-3 border rounded outline-none focus:ring-2 focus:ring-blue-300"
      />
      <button
        onClick={subscribe}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Subscribe
      </button>
      {status && (
        <p className="mt-3 text-sm text-center text-gray-700">{status}</p>
      )}
    </div>
  );
}
