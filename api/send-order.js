import nodemailer from "nodemailer";

const ORDER_EMAIL = process.env.ORDER_EMAIL || "djoshmithadevarakonda@gmail.com";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, phone, address, items, total } = req.body || {};

  if (!name || !phone || !address || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ error: "Missing order details" });
    return;
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    res.status(500).json({ error: "Email service is not configured" });
    return;
  }

  const lines = items
    .map((l) => `- ${l.name} (${l.unit}) x ${l.qty} = Rs. ${l.qty * l.price}`)
    .join("\n");

  const text =
    `New order from Sathva Siri website\n\n` +
    `Customer name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Delivery address: ${address}\n\n` +
    `Order items:\n${lines}\n\n` +
    `Total: Rs. ${total}\n`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: `Sathva Siri Orders <${process.env.GMAIL_USER}>`,
      to: ORDER_EMAIL,
      subject: "New Order - Sathva Siri",
      text,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Send order error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
}
