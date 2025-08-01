const http = require("http");

let healthStatus = {};

function checkServer(server) {
  return new Promise((resolve) => {
    const req = http.get(`http://${server.host}:${server.port}`, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on("error", () => resolve(false));
    req.setTimeout(1000, () => req.destroy());
  });
}

function startHealthChecks(servers) {
  setInterval(async () => {
    for (const srv of servers) {
      const healthy = await checkServer(srv);
      healthStatus[srv.port] = healthy;
    }
  }, 3000);
}

function getHealthyServers() {
  return Object.entries(healthStatus)
    .filter(([_, ok]) => ok)
    .map(([port]) => ({ host: "localhost", port: parseInt(port) }));
}

module.exports = { startHealthChecks, getHealthyServers };
