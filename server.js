const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middleware
const cors = require("cors");

// Update CORS middleware
app.use(cors({
  origin: "https://nindo.jcink.net", // Allow requests from your site
  methods: ["POST"],
  allowedHeaders: ["Content-Type"]
}));


// Mock data simulating user activity
const userPostLogs = {
  "12345": {
    "5": [1, 2, 3, 4, 5],
    "18": [1, 3, 4],
    "15": [1, 2, 3],
  },
};

// API Endpoint: Check if the user has posted every day
app.post("/api/check-all-days", (req, res) => {
  const { categoryIDs, userID } = req.body;

  if (!userID || !categoryIDs) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const daysPosted = new Set();

  categoryIDs.forEach((categoryID) => {
    if (userPostLogs[userID] && userPostLogs[userID][categoryID]) {
      userPostLogs[userID][categoryID].forEach((day) => daysPosted.add(day));
    }
  });

  const allDaysPosted = Array.from(daysPosted).length >= 25;

  res.json({ allDaysPosted });
});

// API Endpoint: Check if the user has posted in the required category for a specific day
app.post("/api/check-posts", (req, res) => {
  const { categoryIDs, userID, day } = req.body;

  if (!userID || !categoryIDs || !day) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const hasPosted = categoryIDs.some(
    (categoryID) =>
      userPostLogs[userID] &&
      userPostLogs[userID][categoryID] &&
      userPostLogs[userID][categoryID].includes(day)
  );

  res.json({ hasPosted });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
