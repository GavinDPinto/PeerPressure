import { Moon, Sun } from "lucide-react";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { useTheme } from "../../theme/ThemeProvider.jsx";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface-2 text-fg ring-focus cursor-pointer hover:bg-line/50 transition-colors"
    >
      <AnimatePresence mode="wait" initial={false}>
        <Motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
        </Motion.span>
      </AnimatePresence>
    </button>
  );
}
