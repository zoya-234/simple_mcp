# **📅 Google Calendar MCP Server**

### A custom Model Context Protocol server that connects Claude Desktop to Google Calendar

This project implements a fully functional **Model Context Protocol (MCP) server** that allows Claude Desktop (and any other MCP-compatible LLM) to **access your Google Calendar securely** using OAuth 2.0.

Once connected, Claude can:

* Read your calendar
* Answer schedule questions
* Parse natural language dates
* Summarize events
* Reason about your availability

---

## 🔥 Features

* ✅ Private Google Calendar access (OAuth 2.0)
* ✅ Fetch all events for any given date
* ✅ Natural language date support (via Claude)
* ✅ Automatic tool invocation inside Claude
* ✅ Secure token storage (`token.json`)
* ✅ Fully compliant MCP server built with Node.js

---

## 📁 Project Structure

```
G-mcp/
│── server.js        # Main MCP server
│── token.js         # OAuth token generator
│── token.json       # OAuth credentials (auto-generated)
│── .env             # Environment variables
│── package.json
│── README.md
```

---

## 🚀 Getting Started

### **1. Clone the repository**

```bash
git clone <your-repo-url>
cd G-mcp
```

---

## **2. Install dependencies**

```bash
npm install
```

Dependencies used:

* `googleapis`
* `dotenv`
* `zod`
* `@modelcontextprotocol/sdk`

---

## **3. Create a Google Cloud OAuth Client**

1. Visit: [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Create new → **OAuth 2.0 Client ID**
3. Application type: **Desktop App**
4. Copy:

   * CLIENT_ID
   * CLIENT_SECRET
5. Add redirect URI:

   ```
   http://localhost:54545/oauth2callback
   ```

---

## **4. Fill your `.env` file**

```
CLIENT_ID=your_client_id_here
CLIENT_SECRET=your_client_secret_here
CALENDAR_ID=your_gmail_here@gmail.com
```

---

## **5. Generate OAuth token**

Run:

```bash
node token.js
```

* A Google login window will open
* Approve access
* `token.json` will be created automatically

> ⭐ **Important:**
> Keep `token.json`. Your MCP server cannot run without it.

---

## **6. Connect the MCP server to Claude Desktop**

Open:

```
Claude → Settings → Tools & Integrations → Local MCP Servers
```

Add:

```json
{
  "command": "node",
  "args": ["C:/MCP/G-mcp/server.js"],
  "env": {
    "CLIENT_ID": "your-client-id",
    "CLIENT_SECRET": "your-client-secret",
    "CALENDAR_ID": "your-calendar-id"
  }
}
```

Restart Claude Desktop.

---

# 🧪 Usage Examples

Once your server is active, try these in Claude:

```
Do I have any meetings today?
```

```
What’s on my schedule for December 5th?
```

```
Check if I have meetings on 2025-12-01.
```

Claude will automatically call the MCP tool:

```
getMyCalendarDataByDate
```

and return natural language answers based on your real calendar.

---

# 🔍 How It Works

### 1. Claude interprets your question

→ Detects a date or intent
→ Chooses the correct MCP tool

### 2. MCP server receives a tool call

→ Calls Google Calendar API
→ Returns structured JSON

### 3. Claude converts JSON → human-friendly response

→ Handles timezone conversion
→ Summarizes meetings cleanly

---

# 🛠 Troubleshooting

### **Log files location:**

```
C:\Users\<your-user>\AppData\Roaming\Claude\logs\
```

Look for:

```
mcp-server-<your-server-name>
```

### Common errors

| Error                 | Meaning                 | Fix                                    |
| --------------------- | ----------------------- | -------------------------------------- |
| `ENOENT token.json`   | token.json not found    | Copy correct file to project root      |
| `invalid_grant`       | Token expired           | Delete token.json → run token.js again |
| `insufficient scopes` | Wrong OAuth permissions | Use calendar.readonly                  |
| `Server disconnected` | Syntax or path issue    | Fix path in Claude config              |

---

# 🔒 Security Notes

* Never commit `.env` or `token.json` to GitHub
* Store secrets locally only
* Use dedicated Google Cloud project if sharing

---

# ✨ Future Enhancements

* Add “create event” support (write access)
* Add weekly/monthly summaries
* Add "find free time slots"
* Multi-calendar support
* Add advanced diagnostics tool

---

# 🤝 Contributing

PRs and feature suggestions are welcome!
Fork the repo, make improvements, and open a pull request.

---

# 📄 License

MIT License

---
