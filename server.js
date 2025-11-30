process.env.DOTENV_CONFIG_QUIET = 'true';

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import dotenv from "dotenv";
import { google } from "googleapis";
import { z } from "zod";
import fs from "fs";

dotenv.config();

// OAuth redirect URI (same as token.js)
const REDIRECT_URI = "http://localhost:54545/oauth2callback";

// Create OAuth client
const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  REDIRECT_URI
);

// Load saved OAuth credentials
oauth2Client.setCredentials(
  JSON.parse(fs.readFileSync("C:/MCP/G-mcp/token.json", "utf8"))
);

// Create MCP server
const server = new McpServer({
  name: "Calendar MCP",
  version: "1.0.0",
});

// Tool function
async function getMyCalendarDataByDate(date) {
  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  // Calculate date range
  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  try {
    const res = await calendar.events.list({
      calendarId: process.env.CALENDAR_ID,
      timeMin: start.toISOString(),
      timeMax: end.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = res.data.items || [];
    const meetings = events.map(event => {
      const eventStart = event.start.dateTime || event.start.date;
      return `${event.summary} at ${eventStart}`;
    });

    return { meetings };

  } catch (err) {
    return { error: err.message };
  }
}

// Register MCP Tool
server.tool(
  "getMyCalendarDataByDate",
  {
    date: z.string().refine(val => !isNaN(Date.parse(val)), {
      message: "Invalid date format.",
    }),
  },
  async ({ date }) => {
    const result = await getMyCalendarDataByDate(date);

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    };
  }
);

// Start server
async function init() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

init();
