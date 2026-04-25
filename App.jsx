import React, { useState, useRef, useCallback } from "react";
import "./index.css";
import Header from "./components/Header";
import Controls from "./components/Controls";
import StatsRow from "./components/StatsRow";
import TypingBox from "./components/TypingBox";
import ResultCard from "./components/ResultCard";
import History from "./components/History";

// ─── Data ───────────────────────────────────────────────────────
const TEXTS = {
  easy: [
    "the quick brown fox jumps over the lazy dog near the river",
    "let x = 10; let y = 20; let total = x + y; print(total);",
    "we traveled across tall mountains to reach the hidden valley before sunset but the journey was long and tiring so we decided to set up camp early and rest under the stars",
    "function getArea(width, height) { return width * height; } const boxArea = getArea(5, 10); if (boxArea > 40) { log('large'); } else { log('small'); }",
  ],
  medium: [
    "React is a JavaScript library for building user interfaces, using reusable components and hooks.",
    "const profile = { user: 'dev_guru', level: 42 }; console.log(`User ${profile.user} is level ${profile.level}`);",
    "Cooking a perfect steak requires precision, high heat, and proper seasoning! First, you must sear the outside to lock in flavor. Then, always remember to let the meat rest before slicing, so it remains juicy and delicious.",
    "import { useState, useEffect } from 'react'; function Timer() { const [time, setTime] = useState(0); useEffect(() => { const timerId = setInterval(() => setTime(t => t + 1), 1000); return () => clearInterval(timerId); }, []); return <div>{time}s</div>; }",
  ],
  hard: [
    "The James Webb Space Telescope allows astronomers to observe distant galaxies formed billions of years ago.",
    "const debounce = (f, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; };",
    "Quantum computing utilizes the principles of quantum mechanics, such as superposition and entanglement. Unlike classical bits that are either zero or one, qubits can exist in multiple states simultaneously. This breakthrough technology promises to solve complex cryptographic problems in seconds!",
    "export const fetchUser = async (id: string): Promise<User> => { try { const res = await api.get(`/users/${id}`); if (!res.ok) throw new Error('Network error'); return await res.json(); } catch (err) { console.error('Fetch failed:', err); throw err; } };",
  ],
};

// ─── Helpers ────────────────────────────────────────────────────
function getRandomText(difficulty) {
  const arr = TEXTS[difficulty];
  return arr[Math.floor(Math.random() * arr.length)];
}

function getHistory() {
  try { return JSON.parse(localStorage.getItem("keyrush_history") || "[]"); }
  catch { return []; }
}

function saveHistory(entry) {
  const history = getHistory();
  const updated = [entry, ...history].slice(0, 5);
  localStorage.setItem("keyrush_history", JSON.stringify(updated));
  return updated;
}

function getBestWpm() {
  const history = getHistory();
  if (!history.length) return 0;
  return Math.max(...history.map((h) => h.wpm));
}

// ─── App ────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState("dark");
  const [difficulty, setDifficulty] = useState("easy");
  const [timeLimit, setTimeLimit] = useState(30);
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [input, setInput] = useState("");
  const [sampleText, setSampleText] = useState(() => getRandomText("easy"));
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(getBestWpm);
  const [history, setHistory] = useState(getHistory);
  const [isNewBest, setIsNewBest] = useState(false);
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);

  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // ─── End Game ─────────────────────────────────────────────────
  const endGame = useCallback((typed, sample, elapsedSec) => {
    clearInterval(timerRef.current);
    setFinished(true);
    setStarted(false);

    const minutes = elapsedSec / 60;
    const calculatedWpm = minutes > 0 ? Math.round(typed.length / 5 / minutes) : 0;

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
      if (typed[i] === sample[i]) correct++;
    }
    const acc = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;

    setWpm(calculatedWpm);
    setAccuracy(acc);

    const entry = {
      wpm: calculatedWpm,
      accuracy: acc,
      difficulty,
      time: timeLimit,
      date: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const updated = saveHistory(entry);
    setHistory(updated);

    if (calculatedWpm > bestWpm) {
      setBestWpm(calculatedWpm);
      setIsNewBest(true);
    } else {
      setIsNewBest(false);
    }
  }, [bestWpm, difficulty, timeLimit]);

  // ─── Timer ────────────────────────────────────────────────────
  const startTimer = useCallback((limit) => {
    clearInterval(timerRef.current);
    let remaining = limit;
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      remaining -= 1;
      setTimeLeft(remaining);

      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setInput((prev) => {
        const mins = elapsed / 60;
        setLiveWpm(mins > 0 ? Math.round(prev.length / 5 / mins) : 0);
        let correct = 0;
        for (let i = 0; i < prev.length; i++) {
          if (prev[i] === sampleText[i]) correct++;
        }
        setLiveAccuracy(prev.length > 0 ? Math.round((correct / prev.length) * 100) : 100);
        return prev;
      });

      if (remaining <= 0) {
        const elapsed = limit;
        setInput((prev) => { endGame(prev, sampleText, elapsed); return prev; });
      }
    }, 1000);
  }, [sampleText, endGame]);

  // ─── Handlers ─────────────────────────────────────────────────
  const handleInput = (e) => {
    if (finished) return;
    const val = e.target.value;
    if (val.length > sampleText.length) return;

    if (!started) {
      setStarted(true);
      startTimer(timeLimit);
    }
    setInput(val);

    if (val.length === sampleText.length) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      endGame(val, sampleText, elapsed);
    }
  };

  const handleRestart = () => {
    clearInterval(timerRef.current);
    setInput(""); setStarted(false); setFinished(false);
    setTimeLeft(timeLimit); setLiveWpm(0); setLiveAccuracy(100);
    setSampleText(getRandomText(difficulty));
  };

  const handleDifficulty = (d) => {
    clearInterval(timerRef.current);
    setDifficulty(d); setInput(""); setStarted(false); setFinished(false);
    setTimeLeft(timeLimit); setLiveWpm(0); setLiveAccuracy(100);
    setSampleText(getRandomText(d));
  };

  const handleTime = (t) => {
    clearInterval(timerRef.current);
    setTimeLimit(t); setTimeLeft(t); setInput(""); setStarted(false); setFinished(false);
    setLiveWpm(0); setLiveAccuracy(100);
    setSampleText(getRandomText(difficulty));
  };

  // ─── Render ───────────────────────────────────────────────────
  return (
    <div className={`app ${theme}`}>
      <div className="grain" />

      <Header bestWpm={bestWpm} theme={theme} onToggleTheme={toggleTheme} />

      <Controls
        difficulty={difficulty}
        timeLimit={timeLimit}
        onDifficulty={handleDifficulty}
        onTime={handleTime}
      />

      {!finished ? (
        <>
          <StatsRow
            started={started}
            liveWpm={liveWpm}
            liveAccuracy={liveAccuracy}
            timeLeft={timeLeft}
          />
          <TypingBox
            sampleText={sampleText}
            input={input}
            started={started}
            finished={finished}
            onInput={handleInput}
          />
        </>
      ) : (
        <ResultCard
          wpm={wpm}
          accuracy={accuracy}
          timeLimit={timeLimit}
          bestWpm={bestWpm}
          isNewBest={isNewBest}
          onRestart={handleRestart}
        />
      )}

      <History history={history} />
    </div>
  );
}
