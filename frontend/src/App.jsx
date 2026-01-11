import { useEffect, useState } from "react";
import HomeScreen from "./pages/HomeScreen.jsx";
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
    <div className="p-12 font-sans bg-gray-900 min-h-screen">
    <HomeScreen/>
    </div>
  );
}
