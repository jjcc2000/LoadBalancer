const http = require("http");
const httpProxy = require("http-proxy");
const WebSocket = require("ws");
const { getHealthyServers, startHealthChecks } = require("./healthChecker");
const { recordRequest, getMetrics } = require("./metrics");

const proxy = httpProxy.createProxyServer({});
const servers = [
  { host: "localhost", port: 3001 },
  { host: "localhost", port: 3002 },
  { host: "localhost", port: 3003 },
];

let current = 0;

startHealthChecks(servers);

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === "/metrics") {
    return res.end(JSON.stringify(getMetrics()));
  }

  const healthy = getHealthyServers();
  console.log("Healthy servers:", healthy);
  if (healthy.length === 0) {
    res.writeHead(503);
    return res.end("No servers available");
  }

  const target = healthy[current % healthy.length];
  current++;
  recordRequest(target.port);

  proxy.web(req, res, {
    target: `http://${target.host}:${target.port}`,
  });
});

const wss = new WebSocket.Server({ server });
wss.on("connection", (client) => {
  const healthy = getHealthyServers();
  if (healthy.length === 0) return client.close();

  const target = healthy[current % healthy.length];
  current++;
  recordRequest(target.port);

  const proxyWs = new WebSocket(`ws://${target.host}:${target.port}`);
  proxyWs.on("open", () => {
    client.on("message", (msg) => proxyWs.send(msg));
    proxyWs.on("message", (msg) => client.send(msg));
  });
});

server.listen(8080, () => {
  console.log("Load balancer at http://localhost:8080");
});
