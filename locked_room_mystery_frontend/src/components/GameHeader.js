import React from "react";

/**
 * PUBLIC_INTERFACE
 * GameHeader - Mini app bar for displaying game progress, actions, and navigation.
 * Props:
 *   clues (Array): Clue list
 *   suspects (Array): Suspect list
 *   onNotebook (fn): Toggle notebook panel
 *   onAccusation (fn): Open accusation menu
 *   phase (string): Current game phase
 */
function GameHeader({ clues, suspects, onNotebook, onAccusation, phase }) {
  // Calculate found clues count (ignore red herrings)
  const found = clues.filter(c => c.found && !c.redHerring).length;
  const total = clues.filter(c => !c.redHerring).length;

  return (
    <header style={{
      width: "100%",
      minHeight: 62, background: "linear-gradient(90deg,#4E6E9A 60%,#F5B041 100%)",
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", fontSize: 18, boxShadow: "0 3px 18px #0001", position: "sticky", top: 0, zIndex: 999
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span role="img" aria-label="logo" style={{ fontSize: 36 }}>🕵️‍♀️</span>
        <span style={{ fontWeight: 600, fontSize: 26, letterSpacing: 1 }}>Locked Room Mystery</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 26, fontSize: 17 }}>
        <span>
          Clues Found: <b>{found} / {total}</b>
        </span>
        <button
          className="cartoon-btn"
          style={{
            background: "#fff8f1",
            color: "#4E6E9A",
            border: "1.5px solid #F5B041",
            borderRadius: 10,
            marginRight: 3,
            cursor: "pointer",
            padding: "5px 14px",
            fontSize: 16,
            fontWeight: "bold",
            transition: "all .2s"
          }}
          onClick={onNotebook}
        >
          📝 Notebook
        </button>
        <button
          className="cartoon-btn"
          style={{
            background: "#E74C3C",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            padding: "6px 22px",
            fontSize: 16,
            fontWeight: "bold",
            transition: "all .18s"
          }}
          onClick={onAccusation}
        >
          Accuse!
        </button>
      </div>
    </header>
  );
}

export default GameHeader;
