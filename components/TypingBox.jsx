import React, { useRef } from "react";

export default function TypingBox({ sampleText, input, started, finished, onInput }) {
  const inputRef = useRef(null);

  // CORE LOGIC: letter by letter comparison
  const renderText = () => {
    return sampleText.split("").map((char, i) => {
      let cls = "char-pending"; // not typed yet → gray
      if (i < input.length) {
        cls = input[i] === char ? "char-correct" : "char-wrong";
      } else if (i === input.length) {
        cls = "char-cursor"; // current position → blinking
      }
      return <span key={i} className={cls}>{char}</span>;
    });
  };

  const progress = input.length / sampleText.length;

  return (
    <>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
      </div>

      <div className="typing-card" onClick={() => inputRef.current?.focus()}>
        <div className="sample-text">{renderText()}</div>
        <textarea
          ref={inputRef}
          className="hidden-input"
          value={input}
          onChange={onInput}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      <p className="hint">
        {started ? "keep going..." : "click above and start typing"}
      </p>
    </>
  );
}
