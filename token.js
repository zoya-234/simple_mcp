import http from "http";
import fs from "fs";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

console.log("Using CLIENT_ID:", process.env.CLIENT_ID);
console.log("Using CLIENT_SECRET:", process.env.CLIENT_SECRET);

const PORT = 54545;

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  `http://localhost:${PORT}/oauth2callback`
);

const url = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/calendar.readonly"],
});

console.log("\nOpen this URL in your browser:\n");
console.log(url);
console.log(`\nWaiting for Google authorization on port ${PORT}...\n`);

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/oauth2callback")) {
    const urlParams = new URL(req.url, `http://localhost:${PORT}`);
    const code = urlParams.searchParams.get("code");

    if (!code) {
      res.end("No OAuth code found.");
      return;
    }

    try {
      const { tokens } = await oauth2Client.getToken(code);
      fs.writeFileSync("token.json", JSON.stringify(tokens));
      console.log("✔ token.json saved successfully!");
      res.end("Token saved! You can close this window.");
      server.close();
    } catch (err) {
      console.error("Error getting token:", err);
      res.end("Error saving token.");
    }
  } else {
    res.end("Invalid endpoint.");
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
