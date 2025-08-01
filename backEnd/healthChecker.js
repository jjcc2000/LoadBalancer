const http = require("http");

let healthStatus = {};
let allServers = []; // To store the initial server objects

function checkServer(server) {
  return new Promise((resolve) => {
    const req = http.get(`http://${server.host}:${server.port}`, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on("error", (err) => {
      console.error(
        `Health check failed for ${server.host}:${server.port}:`,
        err.message
      );
      resolve(false);
    });
    req.setTimeout(1000, () => req.destroy());
  });
}

function startHealthChecks(servers) {
  allServers = servers; // Store the initial list of servers
  setInterval(async () => {
    for (const srv of allServers) {
      const healthy = await checkServer(srv);
      if (healthy) {
        healthStatus[srv.port] = srv;
      } else {
        delete healthStatus[srv.port];
      }
    }
    console.log("Current healthy servers:", Object.values(healthStatus));
  }, 3000);
}

function getHealthyServers() {
  return Object.values(healthStatus);
}

module.exports = { startHealthChecks, getHealthyServers };
