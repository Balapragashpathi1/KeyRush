import React from "react";

const TIMES = [15, 30, 60];

export default function Controls({ difficulty, timeLimit, onDifficulty, onTime }) {
  return (
    <div className="controls">
      <div className="control-group">
        {["easy", "medium", "hard"].map((d) => (
          <button
            key={d}
            className={`ctrl-btn ${difficulty === d ? "active" : ""}`}
            onClick={() => onDifficulty(d)}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="divider" />
      <div className="control-group">
        {TIMES.map((t) => (
          <button
            key={t}
            className={`ctrl-btn ${timeLimit === t ? "active" : ""}`}
            onClick={() => onTime(t)}
          >
            {t}s
          </button>
        ))}
      </div>
    </div>
  );
}
