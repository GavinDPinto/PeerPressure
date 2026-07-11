import { motion as Motion } from "framer-motion";
import pp from "../../assets/pp.png";

export default function Splash() {
  return (
    <Motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-bg animate-swipeUp"
    >
      <Motion.img
        src={pp}
        alt="PeerPressure logo"
        className="h-20 w-20 rounded-2xl shadow-(--shadow-brand)"
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <Motion.h1
        className="text-3xl font-extrabold tracking-tight sm:text-4xl"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      >
        Peer<span className="grad-text">Pressure</span>
      </Motion.h1>
    </Motion.div>
  );
}
