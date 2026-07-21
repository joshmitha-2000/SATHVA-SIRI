import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sendOrder from "./send-order.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Print ENV when server starts
console.log("🔍 ENV CHECK:");
console.log("EMAIL USER:", process.env.GMAIL_USER);
console.log(
  "EMAIL PASS EXISTS:",
  !!process.env.GMAIL_APP_PASSWORD
);

// API route
app.post("/api/send-order", (req, res) => {
  console.log("📩 Incoming request:", req.body);
  sendOrder(req, res);
});

app.get("/", (req, res) => {
  res.send("API running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});