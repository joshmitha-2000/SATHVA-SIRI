import nodemailer from "nodemailer";

const ORDER_EMAIL =
  process.env.ORDER_EMAIL || "djoshmithadevarakonda@gmail.com";

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isValidEmail(value) {
  const at = value.indexOf("@");
  if (at <= 0 || at !== value.lastIndexOf("@")) return false;
  const domain = value.slice(at + 1);
  return domain.includes(".") && !domain.startsWith(".") && !domain.endsWith(".") && !value.includes(" ");
}

export default async function sendOrder(req, res) {
  try {
    const { name, phone, email, address, items, total } = req.body || {};

    // ✅ Validation
    if (
      !name ||
      !phone ||
      !email ||
      !address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({ error: "Missing order details" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: "Phone number must be 10 digits" });
    }

    // ✅ ENV check
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      return res.status(500).json({
        error: "Email config missing",
      });
    }

    // ✅ Format items (plain text fallback)
    const lines = items
      .map(
        (l) =>
          `- ${l.name} (${l.unit}) x ${l.qty} = Rs. ${l.qty * l.price}`
      )
      .join("\n");

    const text = `
New Order from Sathva Siri

Name: ${name}
Phone: ${phone}
Email: ${email}
Address: ${address}

Items:
${lines}

Total: Rs. ${total}
`;

    // ✅ HTML order items rows
    const itemRows = items
      .map(
        (l) => `
          <tr>
            <td style="padding:10px 12px;border-bottom:1px solid #EFE6D0;color:#3A3126;">${escapeHtml(
              l.name
            )} <span style="color:#9A8F78;font-size:12px;">(${escapeHtml(
          l.unit
        )})</span></td>
            <td style="padding:10px 12px;border-bottom:1px solid #EFE6D0;color:#3A3126;text-align:center;">${l.qty}</td>
            <td style="padding:10px 12px;border-bottom:1px solid #EFE6D0;color:#3A3126;text-align:right;">₹${
              l.qty * l.price
            }</td>
          </tr>`
      )
      .join("");

    const html = `
<div style="background:#FBF6EA;padding:32px 16px;font-family:Georgia,'Times New Roman',serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #E4D6B8;border-radius:16px;overflow:hidden;">
    <div style="background:#B08D57;padding:20px 24px;">
      <h1 style="margin:0;font-size:20px;color:#ffffff;">🛒 New Order — Sathva Siri</h1>
    </div>
    <div style="padding:24px;">
      <h2 style="margin:0 0 12px;font-size:15px;color:#3A3126;">Customer Details</h2>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px;">
        <tr>
          <td style="padding:4px 0;color:#9A8F78;width:90px;">Name</td>
          <td style="padding:4px 0;color:#3A3126;">${escapeHtml(name)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#9A8F78;">Phone</td>
          <td style="padding:4px 0;color:#3A3126;">${escapeHtml(phone)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#9A8F78;">Email</td>
          <td style="padding:4px 0;color:#3A3126;">${escapeHtml(email)}</td>
        </tr>
        <tr>
          <td style="padding:4px 0;color:#9A8F78;vertical-align:top;">Address</td>
          <td style="padding:4px 0;color:#3A3126;">${escapeHtml(address)}</td>
        </tr>
      </table>

      <h2 style="margin:0 0 12px;font-size:15px;color:#3A3126;">Order Items</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <thead>
          <tr>
            <th style="padding:8px 12px;text-align:left;color:#9A8F78;font-size:12px;border-bottom:2px solid #E4D6B8;">Item</th>
            <th style="padding:8px 12px;text-align:center;color:#9A8F78;font-size:12px;border-bottom:2px solid #E4D6B8;">Qty</th>
            <th style="padding:8px 12px;text-align:right;color:#9A8F78;font-size:12px;border-bottom:2px solid #E4D6B8;">Amount</th>
          </tr>
        </thead>
        <tbody>${itemRows}</tbody>
        <tfoot>
          <tr>
            <td style="padding:12px;font-weight:bold;color:#3A3126;">Total</td>
            <td></td>
            <td style="padding:12px;text-align:right;font-weight:bold;color:#B08D57;font-size:16px;">₹${total}</td>
          </tr>
        </tfoot>
      </table>

      <p style="margin:24px 0 0;font-size:12px;color:#9A8F78;">
        Reply directly to this email to contact ${escapeHtml(name)} at ${escapeHtml(
      email
    )}.
      </p>
    </div>
  </div>
</div>`;

    // ✅ Transporter (BEST CONFIG)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // ✅ Send email — sent via our Gmail account, but reply-to is the customer's
    // email so the team can just hit "Reply" to reach them directly.
    await transporter.sendMail({
      from: `Sathva Siri <${process.env.GMAIL_USER}>`,
      to: ORDER_EMAIL,
      replyTo: `${name} <${email}>`,
      subject: `🛒 New Order from ${name}`,
      text,
      html,
    });

    console.log("✅ Email sent successfully");

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ EMAIL ERROR:", err);

    return res.status(500).json({
      error: "Failed to send email",
      detail: err.message,
    });
  }
}
