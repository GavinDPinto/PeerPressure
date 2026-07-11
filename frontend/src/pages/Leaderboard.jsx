import { useState, useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { Trophy, Medal } from "lucide-react";
import { api } from "../utils/api.js";
import Card from "../components/ui/Card.jsx";
import Skeleton from "../components/ui/Skeleton.jsx";
import { cn } from "../lib/utils.js";

const RANK_STYLE = [
  { tone: "text-gold", bg: "bg-gold/10" },
  { tone: "text-silver", bg: "bg-silver/10" },
  { tone: "text-bronze", bg: "bg-bronze/10" },
];

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setCurrentUser(user.username);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const data = await api.getLeaderboard();
      setLeaderboard(data.leaderboard);
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2.5">
        <Trophy size={26} className="text-gold" />
        <h1 className="text-2xl font-extrabold tracking-tight">Leaderboard</h1>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="flex flex-col gap-1 p-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : leaderboard.length === 0 ? (
          <p className="py-10 text-center text-muted">No users found</p>
        ) : (
          <div className="divide-y divide-line">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.username === currentUser;
              const rank = RANK_STYLE[index];

              return (
                <Motion.div
                  key={entry.username}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={cn(
                    "flex items-center gap-4 p-4 transition-colors",
                    isCurrentUser && "border-l-4 border-brand bg-brand-soft/40"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold",
                      rank ? cn(rank.bg, rank.tone) : "bg-surface-2 text-muted"
                    )}
                  >
                    {index < 3 ? <Medal size={20} /> : `#${index + 1}`}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate font-semibold", isCurrentUser && "text-brand")}>
                      {entry.username}
                      {isCurrentUser && <span className="ml-2 text-xs font-normal text-muted">(You)</span>}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold grad-text">Lvl {entry.level}</p>
                    <p className="text-xs text-muted">{entry.total_points} pts</p>
                  </div>
                </Motion.div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
