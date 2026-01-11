import { useState } from "react";
import SignUp from "./SignUp.jsx";
import { api } from "../utils/api.js";

export default function LogIn({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [warning, setWarning] = useState("");

  if (showSignUp) {
    return <SignUp onSignUp={onLogin} onBack={() => setShowSignUp(false)} />;
  }

  const handleLogin = async () => {
    if (!username || !password) {
      setWarning("⚠️ Please enter both username and password!");
      return;
    }
    setWarning("");
    
    try {
      const response = await api.login(username, password);
      const data = await response.json();
      
      if (response.ok) {
        // Store JWT token and user data in localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify({ username: data.username, email: data.email }));
        onLogin();
      } else {
        setWarning(`⚠️ ${data.detail || "Login failed"}`);
      }
    } catch (error) {
      setWarning("⚠️ Cannot connect to server. Make sure backend is running.");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="h-full flex justify-center items-center px-4 py-10 bg-gray-900">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <button
          onClick={() => setShowSignUp(true)}
          className="text-blue-400 cursor-pointer font-semibold text-center"
        >
          Don't have an account? Sign up!
        </button>

        <h1 className="text-2xl font-bold text-white">Log In</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none"
        />

        <button
          onClick={handleLogin}
          className="w-full py-3 rounded-xl cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-semibold"
        >
          Log In
        </button>

        {warning && (
          <div className="mt-2 p-3 bg-yellow-200 border-l-4 border-yellow-600 text-yellow-800 rounded">
            {warning}
          </div>
        )}
      </div>
    </div>
  );
}
