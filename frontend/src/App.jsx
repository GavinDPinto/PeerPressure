import { useState, useEffect } from "react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";
import AppShell from "./components/layout/AppShell.jsx";
import Splash from "./components/layout/Splash.jsx";
import HomeScreen from "./pages/HomeScreen.jsx";
import Account from "./pages/Account.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Auth from "./pages/Auth.jsx";
import { api } from "./utils/api.js";
import { PREVIEW_MODE } from "./utils/previewData.js";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [loggedIn, setLoggedIn] = useState(() => PREVIEW_MODE || !!localStorage.getItem("user"));
  const [showSplash, setShowSplash] = useState(true);
  const [tokens, setTokens] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      setLoggedIn(false);
      setActiveTab("home");
      setTokens(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  useEffect(() => {
    if (!loggedIn) return;
    api
      .getScore()
      .then((data) => setTokens(data.total_points))
      .catch(() => {});
  }, [loggedIn]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setLoggedIn(false);
    setActiveTab("home");
    setTokens(null);
  };

  return (
    <ThemeProvider>
      <AnimatePresence>{showSplash && <Splash />}</AnimatePresence>

      {!showSplash && !loggedIn && (
        <Auth
          onAuth={() => {
            setLoggedIn(true);
            setActiveTab("home");
          }}
        />
      )}

      {!showSplash && loggedIn && (
        <AppShell activeTab={activeTab} setActiveTab={setActiveTab} tokens={tokens}>
          <AnimatePresence mode="wait">
            <Motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === "home" && <HomeScreen onTokensChange={setTokens} />}
              {activeTab === "leaderboard" && <Leaderboard />}
              {activeTab === "account" && <Account onLogout={handleLogout} />}
            </Motion.div>
          </AnimatePresence>
        </AppShell>
      )}
    </ThemeProvider>
  );
}
