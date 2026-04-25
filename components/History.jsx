import React from "react";
import { motion } from "framer-motion";

export default function History({ history }) {
  if (!history.length) return null;

  return (
    <motion.div
      className="history"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="history-title">recent attempts</div>
      <div className="history-list">
        {history.map((h, i) => (
          <motion.div
            key={i}
            className="history-item"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <span className="history-wpm">{h.wpm} wpm</span>
            <span className="history-acc">{h.accuracy}% acc</span>
            <span className="history-acc">{h.difficulty}</span>
            <span className="history-date">{h.date}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
