// servers/server2.js
const http = require("http");
const WebSocket = require("ws");

const PORT = 3003;

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.statusCode = 200;
    res.end();
    return;
  }
  res.end(`Hello from server on port ${PORT}`);
});

const wss = new WebSocket.Server({ server });
wss.on("connection", (ws) => {
  ws.send(`WebSocket from port ${PORT}`);
  ws.on("message", (msg) => ws.send(`[${PORT}] You said: ${msg}`));
});

server.listen(PORT, () => console.log(`Server running on ${PORT}`));
