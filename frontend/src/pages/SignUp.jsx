import { useState } from "react";
import LogIn from "./LogIn.jsx";
import { api } from "../utils/api.js";

export default function SignUp({ onSignUp, onBack }) {
  const [logIn, setLogIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");

  if (logIn) return <LogIn onLogin={onSignUp} />;

  const handleSignUp = async () => {
    if (!username || !email || !password) {
      setWarning("⚠️ Please fill in all fields before signing up!");
      return;
    }

    try {
      const response = await api.signup(username, email, password);
      const data = await response.json();
      
      if (response.ok) {
        // Store JWT token and user data in localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify({ username: data.username, email: data.email }));
        setWarning("✅ Account created successfully! Logging you in...");
        setTimeout(() => {
          if (onSignUp) onSignUp();
        }, 1500);
      } else {
        setWarning(`⚠️ ${data.detail || "Signup failed"}`);
      }
    } catch (error) {
      setWarning("⚠️ Cannot connect to server. Make sure backend is running.");
      console.error("Signup error:", error);
    }
  };

  return (
    <div className="h-full overflow-y-auto flex justify-center px-4 py-10">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col gap-6">
        <button
          onClick={() => {
            if (onBack) onBack();
            else setLogIn(true);
          }}
          className="text-blue-400 cursor-pointer font-semibold text-center"
        >
          Already have an account? Log in!
        </button>

        <h1 className="text-2xl font-bold text-white">Sign Up</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 rounded-xl bg-gray-800 text-white focus:outline-none"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={handleSignUp}
          className="w-full py-3 cursor-pointer rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold"
        >
          Sign Up
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
