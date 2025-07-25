// pages/api/subscribe.ts
import type { NextApiRequest, NextApiResponse } from "next";
import Africastalking from "africastalking";

const africastalking = Africastalking({
  apiKey: process.env.AT_API_KEY!,
  username: "sandbox", // use your live username in production
});

const sms = africastalking.SMS;

export async function POST(
  req: Request,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return Response.json({ success: false, message: "Method Not Allowed" });
  }

  const { phoneNumber, city } = await req.json();

  console.log("phon", phoneNumber, city,);
  

  if (!phoneNumber || !city) {
    return Response.json({ success: false, message: "Missing phone number or city" });
  }

  try {
    const result = await sms.send({
      to: [phoneNumber],
      message: `✅ You’ve subscribed to ${city} weather alerts!`,
      from: "91941", // your short code or sender ID
    });

    return Response.json({ success: true, result });
  } catch (error) {
    console.error("Error sending SMS:", error);
    return Response.json({ success: false, message: "SMS failed to send", error });
  }
}

