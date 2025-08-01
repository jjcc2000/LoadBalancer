import "./App.css";
import { useEffect, useState } from "react";
import ServerCard from "./components/ServerCard";

type Metrics = { [port: string]: number };
type Server = { port: number; healthy: boolean };

function App() {
  const [metrics, setMetrics] = useState<Metrics>({});
  const [servers, setServers] = useState<Server[]>([]);

  const ports = [3001, 3002, 3003]; // Puedes hacer esto dinámico si gustas

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:8080/metrics");
      const data = await res.json();
      setMetrics(data);
    };

    const checkHealth = async () => {
      const results = await Promise.all(
        ports.map((port) =>
          fetch(`http://localhost:${port}`)
            .then(() => ({ port, healthy: true }))
            .catch(() => ({ port, healthy: false }))
        )
      );
      setServers(results);
    };

    fetchData();
    checkHealth();
    const interval = setInterval(() => {
      fetchData();
      checkHealth();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Load Balancer Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {servers.map(({ port, healthy }) => (
          <ServerCard
            key={port}
            port={port}
            healthy={healthy}
            requests={metrics[port] ?? 0}
          />
        ))}
      </div>
    </main>
  );
}

export default App;
