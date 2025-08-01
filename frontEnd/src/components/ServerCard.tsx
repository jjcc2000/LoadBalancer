type Props = {
  port: number;
  requests: number;
  healthy: boolean;
};

export default function ServerCard({ port, requests, healthy }: Props) {
  return (
    <div className={`p-4 rounded-lg shadow bg-gray-800 text-white border-l-4 ${healthy ? "border-green-500" : "border-red-500"}`}>
      <h3 className="text-lg font-semibold">Server {port}</h3>
      <p>Status: <span className={healthy ? "text-green-400" : "text-red-400"}>{healthy ? "Healthy" : "Down"}</span></p>
      <p>Requests: {requests}</p>
    </div>
  );
}
