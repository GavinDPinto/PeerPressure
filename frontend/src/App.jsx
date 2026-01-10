import { useEffect, useState } from "react";

export default function App() {
  const [status, setStatus] = useState("Connecting...");
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api")
      .then((res) => {
        if (!res.ok) throw new Error("Request failed");
        return res.json();
      })
      .then((json) => {
        setStatus("Connected ✅");
        setData(json);
      })
      .catch(() => {
        setStatus("Connection Failed ❌");
      });
  }, []);

  return (
    <div className="min-h-screen bg-green-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">
          TAILWIND TEST
        </h1>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs uppercase text-gray-500 font-semibold">
              Frontend
            </p>
            <p className="text-green-600 font-bold">
              Tailwind Working
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg">
            <p className="text-xs uppercase text-gray-500 font-semibold">
              Backend
            </p>
            <p
              className={`font-bold ${
                status.includes("Failed")
                  ? "text-red-500"
                  : status.includes("Connected")
                  ? "text-green-600"
                  : "text-gray-500"
              }`}
            >
              {status}
            </p>

            {data && (
              <pre className="mt-2 text-xs text-gray-400 text-left bg-gray-100 p-2 rounded">
{JSON.stringify(data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
