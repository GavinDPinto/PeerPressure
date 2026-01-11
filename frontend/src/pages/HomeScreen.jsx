import ActiveTasks from "../components/ActiveTasks.jsx";
import TokenDisplay from "../components/TokenDisplay.jsx";

export default function HomeScreen() {
  return (
    <div className="flex flex-row gap-10">
        <TokenDisplay/>
        <ActiveTasks/>
    </div>
  );
}