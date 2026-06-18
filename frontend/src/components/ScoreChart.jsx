function ScoreChart({ score }) {
  const degree = Math.min(100, Math.max(0, score));
  const stroke = 12;
  const radius = 72;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (degree / 100) * circumference;

  return (
    <div className="score-chart">
      <div className="score-ring">
        <svg width={radius * 2} height={radius * 2} className="score-svg">
          <circle
            stroke="rgba(148,163,184,0.15)"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <circle
            stroke="url(#score-gradient)"
            fill="transparent"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          >
            <defs>
              <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </circle>
        </svg>
        <div className="score-center">{degree}</div>
      </div>
      <div className="score-caption">Overall resume score</div>
    </div>
  )
}

export default ScoreChart;
