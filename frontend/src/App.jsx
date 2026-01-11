import { useState } from "react";
import HomeScreen from "./pages/HomeScreen.jsx";
import Account from "./pages/Account.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import LogIn from "./pages/LogIn.jsx";
import SignUp from "./pages/SignUp.jsx";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [loggedIn, setLoggedIn] = useState(() => {
    // Check if user is already logged in from localStorage
    return !!localStorage.getItem("user");
  });
  const [authScreen, setAuthScreen] = useState("login"); // "login" | "signup" | null

  return (
    <div className="font-sans min-h-screen flex flex-col bg-gray-900 text-white">
      <div className="flex-1 overflow-auto p-4">

        {/* AUTH SCREENS */}
        {!loggedIn && authScreen === "login" && (
          <LogIn
            onLogin={() => {
              setLoggedIn(true);    // user is now logged in
              setActiveTab("home"); // make Home the active tab
              setAuthScreen(null);  // hide auth screens
            }}
            onSignUp={() => setAuthScreen("signup")}
          />
        )}

        {!loggedIn && authScreen === "signup" && (
          <SignUp
            onSignUp={() => {
              setLoggedIn(true);    // user is now logged in
              setActiveTab("home"); // make Home the active tab
              setAuthScreen(null);  // hide auth screens
            }}
            onBack={() => setAuthScreen("login")}
          />
        )}

        {/* MAIN APP */}
        {loggedIn && activeTab === "home" && <HomeScreen />}
        {loggedIn && activeTab === "leaderboard" && <Leaderboard />}
        {loggedIn && activeTab === "account" && (
          <Account
            onLogout={() => {
              localStorage.removeItem("token"); // Clear JWT token
              localStorage.removeItem("user"); // Clear stored user data
              setLoggedIn(false);
              setAuthScreen("login"); // go back to login on logout
            }}
          />
        )}
      </div>

      {/* TAB BAR */}
      {loggedIn && (
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      )}
    </div>
  );
}

function TabBar({ activeTab, setActiveTab }) {
  return (
    <div className="h-20 bg-gray-900 border-t border-gray-800 flex justify-around items-center gap-2 px-4">
      <Tab label="Home" icon="🏠" active={activeTab === "home"} onClick={() => setActiveTab("home")} />
      <Tab label="Leaderboard" icon="🏆" active={activeTab === "leaderboard"} onClick={() => setActiveTab("leaderboard")} />
      <Tab label="Account" icon="👤" active={activeTab === "account"} onClick={() => setActiveTab("account")} />
    </div>
  );
}

function Tab({ label, icon, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-2 px-4 rounded-lg transition-all duration-200 ${
        active 
          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" 
          : "text-gray-400 hover:text-white hover:bg-gray-800"
      }`}
    >
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}
