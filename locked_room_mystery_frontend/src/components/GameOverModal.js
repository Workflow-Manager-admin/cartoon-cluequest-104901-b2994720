import React from "react";

/**
 * PUBLIC_INTERFACE
 * GameOverModal – Shows game result and lets player restart.
 * Props:
 *   ending: {type, suspect}
 *   onRestart: fn()
 */
function GameOverModal({ ending, onRestart }) {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      background: "#0007",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1001
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 18,
        minWidth: 300, maxWidth: 390,
        padding: 35,
        boxShadow: "0 4px 44px #4E6E9A44",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#4E6E9A", marginBottom: 7 }}>
          {ending?.type === "success" ? "Case Closed!" :
            (ending?.type === "fail-clues" ? "Unsolved..." : "Mistaken Accusation!")}
        </h2>
        <div style={{ fontSize: 42 }}>{ending?.suspect ? ending.suspect.emoji : "❓"}</div>
        <div style={{ color: "#E74C3C", margin: "10px 0" }}>
          {ending?.suspect ? ending.suspect.name : ""}
        </div>
        <button
          onClick={onRestart}
          className="cartoon-btn"
          style={{
            background: "#F5B041",
            color: "#4E6E9A",
            borderRadius: 11,
            border: "none",
            fontWeight: 700,
            fontSize: 18,
            marginTop: 17,
            padding: "9px 30px",
            cursor: "pointer",
            boxShadow: "0 1px 12px #E74C3C22"
          }}
        >
          Play Again?
        </button>
      </div>
    </div>
  );
}

export default GameOverModal;
