export default function TokenDisplay({ tokens = 75 }) {
    const radius = 50
    const circumference = Math.PI * radius
    const offset = circumference * (1 - tokens / 100)
  return (
    <div className="w-120 h-120 flex flex-col items-center justify-center text-white text-center">
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <path
      d="M10 50 A50 50 0 0 1 110 50"
      fill="none"
      stroke="#e5e7eb"
      strokeWidth="10"
      strokeLinecap="round"
    />
    <path
        d="M10 50 A50 50 0 0 1 110 50"
        fill="none"
        stroke="url(#rainbow)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
    />
    <defs>
      <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f87171" />
        <stop offset="25%" stopColor="#fbbf24" />
        <stop offset="50%" stopColor="#34d399" />
        <stop offset="75%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#a78bfa" />
      </linearGradient>
    </defs>
  </svg>
  <p className="font-bold text-5xl">Tokens: {tokens}</p>
</div>

  )
}
