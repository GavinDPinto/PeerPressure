import { useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Lock, Mail, User as UserIcon } from "lucide-react";
import { api } from "../utils/api.js";
import { Input } from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import pp from "../assets/pp.png";

export default function Auth({ onAuth }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const switchMode = (next) => {
    setMode(next);
    setWarning("");
    setInfo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setWarning("");
    setInfo("");

    if (!username || !password || (isSignup && !email)) {
      setWarning("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const response = isSignup
        ? await api.signup(username, email, password)
        : await api.login(username, password);
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify({ username: data.username, email: data.email })
        );
        if (isSignup) {
          setInfo("Account created! Logging you in...");
          setTimeout(() => onAuth(), 900);
        } else {
          onAuth();
        }
      } else {
        setWarning(data.detail || (isSignup ? "Signup failed" : "Login failed"));
      }
    } catch (error) {
      setWarning("Cannot connect to server. Make sure the backend is running.");
      console.error(`${mode} error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <img src={pp} alt="" className="h-14 w-14 rounded-2xl shadow-(--shadow-brand)" />
          <h1 className="text-2xl font-extrabold tracking-tight">
            Peer<span className="grad-text">Pressure</span>
          </h1>
          <p className="text-sm text-muted">Set goals. Get pushed. Level up.</p>
        </div>

        <Card className="p-6">
          <div className="mb-6 grid grid-cols-2 rounded-xl bg-surface-2 p-1">
            <ModeTab label="Log In" active={!isSignup} onClick={() => switchMode("login")} />
            <ModeTab label="Sign Up" active={isSignup} onClick={() => switchMode("signup")} />
          </div>

          <AnimatePresence mode="wait">
            <Motion.form
              key={mode}
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: isSignup ? 12 : -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex flex-col gap-4"
            >
              {isSignup && (
                <div className="rounded-lg border border-brand/30 bg-brand-soft px-3 py-2 text-xs text-on-brand-soft">
                  Your username is public and shown on the leaderboard.
                </div>
              )}

              <Input
                icon={UserIcon}
                type="text"
                placeholder="Username"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              {isSignup && (
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              )}

              <Input
                icon={Lock}
                type="password"
                placeholder="Password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" size="lg" disabled={loading} className="mt-1 w-full">
                {loading ? <Spinner /> : isSignup ? "Create Account" : "Log In"}
              </Button>

              {warning && (
                <div className="flex items-start gap-2 rounded-lg border border-warn/30 bg-warn-soft px-3 py-2 text-sm text-warn">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>{warning}</span>
                </div>
              )}
              {info && (
                <div className="rounded-lg border border-success/30 bg-success-soft px-3 py-2 text-sm text-success">
                  {info}
                </div>
              )}
            </Motion.form>
          </AnimatePresence>
        </Card>
      </div>
    </div>
  );
}

function ModeTab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative cursor-pointer rounded-lg py-2 text-sm font-semibold transition-colors ${
        active ? "bg-surface text-fg shadow-(--shadow-sm)" : "text-muted hover:text-fg"
      }`}
    >
      {label}
    </button>
  );
}
