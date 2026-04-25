import React from "react";
import { motion } from "framer-motion";

export default function ResultCard({ wpm, accuracy, timeLimit, bestWpm, isNewBest, onRestart }) {
  return (
    <motion.div
      className="result-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="result-title">test complete</div>

      <div className="result-grid">
        {[
          { val: wpm, label: "wpm" },
          { val: `${accuracy}%`, label: "accuracy" },
          { val: `${timeLimit}s`, label: "duration" },
          { val: bestWpm, label: "best wpm" },
        ].map((item, i) => (
          <motion.div
            key={i}
            className="result-stat"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08, duration: 0.3 }}
          >
            <div className="result-val">{item.val}</div>
            <div className="result-label">{item.label}</div>
          </motion.div>
        ))}
      </div>

      {isNewBest && (
        <motion.div
          className="new-best"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          🔥 new personal best!
        </motion.div>
      )}

      <button className="restart-btn" onClick={onRestart}>try again</button>
    </motion.div>
  );
}
