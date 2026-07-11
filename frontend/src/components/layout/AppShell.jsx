import { Home, Trophy, User } from "lucide-react";
import { motion as Motion } from "framer-motion";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import { cn } from "../../lib/utils.js";
import pp from "../../assets/pp.png";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "leaderboard", label: "Ranks", icon: Trophy },
  { id: "account", label: "Profile", icon: User },
];

export default function AppShell({ activeTab, setActiveTab, tokens, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <img src={pp} alt="" className="h-8 w-8 rounded-lg" />
            <span className="text-lg font-extrabold tracking-tight">
              Peer<span className="grad-text">Pressure</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {typeof tokens === "number" && (
              <div className="hidden items-center gap-1.5 rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm font-semibold sm:flex">
                <span className="grad-text">{tokens}</span>
                <span className="text-muted font-medium">pts</span>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-6 sm:px-6">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-around gap-1 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {TABS.map((tab) => (
            <TabButton
              key={tab.id}
              tab={tab}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}

function TabButton({ tab, active, onClick }) {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-xl px-4 py-2 ring-focus transition-colors max-w-[7rem]",
        active ? "text-brand-fg" : "text-muted hover:text-fg"
      )}
    >
      {active && (
        <Motion.div
          layoutId="tab-pill"
          className="absolute inset-0 grad-brand rounded-xl shadow-(--shadow-brand)"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <Icon size={20} className="relative z-10" />
      <span className="relative z-10 text-xs font-semibold">{tab.label}</span>
    </button>
  );
}
