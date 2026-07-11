import { Flame } from "lucide-react";
import ProgressRing from "../ui/ProgressRing.jsx";
import Card from "../ui/Card.jsx";
import Skeleton from "../ui/Skeleton.jsx";
import { levelInfo } from "../../lib/utils.js";

export default function LevelCard({ tokens, loading }) {
  if (loading) {
    return (
      <Card className="flex items-center gap-6 p-6">
        <Skeleton className="h-32 w-32 rounded-full shrink-0" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>
      </Card>
    );
  }

  const { level, progress, pointsIntoLevel, pointsForNextLevel } = levelInfo(tokens ?? 0);

  return (
    <Card className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:gap-8">
      <ProgressRing progress={progress} size={140} stroke={11}>
        <span className="text-3xl font-extrabold leading-none">{level}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">Level</span>
      </ProgressRing>

      <div className="flex flex-1 flex-col items-center gap-2 sm:items-start">
        <div className="flex items-center gap-2 text-2xl font-extrabold">
          <span className="grad-text">{tokens ?? 0}</span>
          <span className="text-base font-semibold text-muted">tokens</span>
        </div>
        <div className="w-full max-w-[220px]">
          <div className="mb-1 flex justify-between text-xs font-medium text-muted">
            <span>{pointsIntoLevel} pts</span>
            <span>{pointsForNextLevel} pts</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
            <div
              className="h-full grad-brand rounded-full transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <p className="flex items-center gap-1.5 text-xs text-muted">
          <Flame size={13} className="text-warn" />
          Keep completing tasks to reach level {level + 1}
        </p>
      </div>
    </Card>
  );
}
