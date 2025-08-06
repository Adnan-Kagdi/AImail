import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Snackbar,
  Paper,
  CircularProgress,
} from "@mui/material";
import "./App.css";

export default function App() {
  const [recipients, setRecipients] = useState("");
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  const generateEmail = async () => {
    if (!prompt) return alert("Please enter a prompt.");
    setLoading(true);
    try {
      const res = await axios.post("https://aimail-p72o.onrender.com/generate-email", {
        prompt,
      });
      setEmailContent(res.data.message);
    } catch {
      alert("Failed to generate email");
    }
    setLoading(false);
  };

  const sendEmail = async () => {
    if (!recipients || !emailContent)
      return alert("Recipient and message required.");

    try {
      await axios.post("https://aimail-p72o.onrender.com/send-email", {
        recipients,
        subject: subject || "AI Generated Email",
        message: emailContent,
      });
      setNotification("Email sent successfully!");
    } catch {
      setNotification("Failed to send email.");
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography className="AI-h" variant="h4" gutterBottom align="center">
        ✨ AI Email Sender
      </Typography>

      <TextField
        label="Recipients (comma-separated)"
        fullWidth
        margin="normal"
        value={recipients}
        onChange={(e) => setRecipients(e.target.value)}
        className="AI-input1"
      />
      <TextField
        label="Subject"
        fullWidth
        margin="normal"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="AI-input1"
      />
      <TextField
        label="Prompt for AI"
        fullWidth
        multiline
        rows={4}
        margin="normal"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="prompt"
      />
      <button className="gnr-button" onClick={generateEmail} disabled={loading}>
        {loading ? <CircularProgress className="loading" size={24} /> : "Generate Email"}
      </button>

      {emailContent && (
        <>
          <Paper className="email-cont" elevation={3} sx={{ mt: 4, p: 2 }}>
            <Typography variant="h6">Generated Email</Typography>
            <TextField
              fullWidth
              multiline
              minRows={10}
              value={emailContent}
              onChange={(e) => setEmailContent(e.target.value)}
              className="AI-input2"
            />
          </Paper>
          <Button
            variant="outlined"
            color="success"
            onClick={sendEmail}
            sx={{ mt: 2 }}
            className="sbm-button"
          >
            Send Email
          </Button>
        </>
      )}

      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification("")}
        message={notification}
      />
    </Container>
  );
}
