import React from "react";

export default function Header({ bestWpm, theme, onToggleTheme }) {
  return (
    <header className="header">
      <div className="logo">Key<span>Rush</span></div>
      <div className="header-right">
        <div className="best">best <span>{bestWpm}</span> wpm</div>
        <button className="theme-btn" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}
