import React, { useState } from "react";

/**
 * PUBLIC_INTERFACE
 * AccusationPanel - Modal for selecting and accusing a suspect.
 * Props:
 *   suspects: Array - all suspects
 *   onAccuse: fn(suspectId)
 *   onCancel: fn()
 */
function AccusationPanel({ suspects, onAccuse, onCancel }) {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      width: "100vw", height: "100vh",
      background: "#0007",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 14,
        minWidth: 330, maxWidth: 410,
        padding: 28, boxShadow: "0 2px 22px #E74C3C1e",
        textAlign: "center", position: "relative"
      }}>
        <button onClick={onCancel}
          style={{
            position: "absolute", top: 10, right: 12,
            border: "none", background: "#ffd3b7", borderRadius: 6,
            color: "#800",
            fontWeight: 700, fontSize: 16
          }}>✕</button>
        <h2 style={{ color: "#E74C3C" }}>🕵️ Time to Make Your Accusation!</h2>
        <div style={{ margin: "20px 0" }}>
          {suspects.map(s => (
            <button
              key={s.id}
              onClick={() => setSelected(s.id)}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: selected === s.id ? "#F5B041" : "#EEE",
                color: "#4E6E9A",
                border: selected === s.id ? "2px solid #E74C3C" : "1px solid #aaa",
                borderRadius: 12,
                fontWeight: 600,
                fontSize: 18,
                padding: "10px 20px",
                margin: "0 7px 8px 0",
                cursor: "pointer",
                boxShadow: selected === s.id ? "0 2px 10px #fa4e1b29" : "none"
              }}
            >
              <span style={{ fontSize: 29 }}>{s.emoji}</span> {s.name}
            </button>
          ))}
        </div>
        <button
          style={{
            marginTop: 10,
            background: "#4E6E9A",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 25px",
            fontWeight: 700,
            fontSize: 19,
            letterSpacing: 0.6,
            cursor: selected ? "pointer" : "not-allowed",
            opacity: selected ? 1 : 0.5
          }}
          disabled={!selected}
          onClick={() => selected ? onAccuse(selected) : undefined}
        >
          Accuse!
        </button>
        <div style={{ marginTop: 14, fontSize: 14, color: "#944" }}>
          Choose carefully—the ending will change!
        </div>
      </div>
    </div>
  );
}

export default AccusationPanel;
