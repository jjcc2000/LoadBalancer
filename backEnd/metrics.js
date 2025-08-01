const stats = {};

function recordRequest(port) {
  stats[port] = stats[port] ? stats[port] + 1 : 1;
}

function getMetrics() {
  return stats;
}

module.exports = { recordRequest, getMetrics };
