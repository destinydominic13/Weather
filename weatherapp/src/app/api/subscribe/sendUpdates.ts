// pages/api/sendUpdates.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Africastalking from "africastalking";

const africastalking = Africastalking({
  apiKey: process.env.AT_API_KEY!,
  username: "sandbox",
});

const sms = africastalking.SMS;

const subscribers = [
  { phone: "+2348012345678", city: "Lagos" },
  { phone: "+254701234567", city: "Nairobi" },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const results: any[] = [];

  for (const user of subscribers) {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${user.city}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    const weather = await weatherRes.json();

    const temp = weather.main?.temp ?? "N/A";
    const condition = weather.weather?.[0]?.description ?? "N/A";

    const message = `🌤 Weather Update for ${user.city}:\nTemp: ${temp}°C\nCondition: ${condition}`;

    try {
      const smsResult = await sms.send({
        to: [user.phone],
        message,
        from: "91941", // or your AT sender ID
      });

      results.push({ phone: user.phone, status: "sent", smsResult });
    } catch (error) {
      results.push({ phone: user.phone, status: "failed", error });
    }
  }

  return res.status(200).json({ success: true, results });
}
