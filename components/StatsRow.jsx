import React from "react";

export default function StatsRow({ started, liveWpm, liveAccuracy, timeLeft }) {
  return (
    <div className="stats-row">
      <div className="stat">
        <div className="stat-val">{started ? liveWpm : "--"}</div>
        <div className="stat-label">wpm</div>
      </div>
      <div className="stat timer-stat">
        <div className={`stat-val ${timeLeft <= 5 && started ? "danger" : ""}`}>
          {timeLeft}
        </div>
        <div className="stat-label">seconds</div>
      </div>
      <div className="stat">
        <div className="stat-val">{started ? liveAccuracy : "--"}</div>
        <div className="stat-label">accuracy %</div>
      </div>
    </div>
  );
}
