const express = require("express");
const cors = require("cors");
require("dotenv").config();
const nodemailer = require("nodemailer");
const axios = require("axios");

const app = express();

app.use(
  cors({
    origin: "https://aimail-37o1.onrender.com/",
  })
);

app.use(express.json());

app.post("/generate-email", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama3-70b-8192",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
      }
    );

    const aiResponse = response.data.choices[0].message.content;
    res.json({ message: aiResponse });
  } catch (error) {
    console.error("Error generating email:", error);
    res.status(500).json({ error: "Failed to generate email" });
  }
});

app.post("/send-email", async (req, res) => {
  const { recipients, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.sendMail({
      from: `"AI Mailer" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject,
      html: `
  <div style="max-width:600px;margin:auto;padding:20px;border:1px solid #ccc;border-radius:8px;font-family:Arial,sans-serif;background-color:#f9f9f9;">
    <h2 style="color:#4a90e2;margin-bottom:10px;">Message from AI Mailer</h2>
    <p style="font-size:15px;line-height:1.6;color:#333;">
      ${message.replace(/\n/g, "<br>")}
    </p>
  </div>
`,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Send error:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
