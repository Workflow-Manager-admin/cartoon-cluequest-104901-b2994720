import React from "react";

/**
 * PUBLIC_INTERFACE
 * SuspectPanel - Panel showing all suspect profiles & status.
 * Props:
 *   suspects: Array - suspect objects
 *   onSuspect: fn(suspectId)
 */
function SuspectPanel({ suspects, onSuspect }) {
  return (
    <div style={{ padding: 26 }}>
      <h2 style={{ color: "#4E6E9A", marginBottom: 8, fontWeight: 700 }}>🕴️ Suspects</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {suspects.map(s => (
          <li key={s.id} style={{
            marginBottom: 18,
            background: "#4E6E9A09",
            borderRadius: 12,
            padding: "14px 13px",
            display: "flex", alignItems: "center", gap: 18,
            boxShadow: "0 1px 6px #A9BFD720"
          }}>
            <span style={{ fontSize: 41 }}>{s.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 18 }}>{s.name}</div>
              <div style={{
                color: s.emotion === "nervous" ? "#E74C3C" :
                  (s.emotion === "calm" ? "#4E6E9A" : "#F5B041"),
                fontWeight: 500,
                fontSize: 15
              }}>
                {`(${s.emotion})`}
              </div>
              <div style={{ color: "#111", fontSize: 14, marginTop: 5 }}>{s.description}</div>
            </div>
            <button
              style={{
                background: "#F5B041",
                color: "#4E6E9A",
                fontWeight: 700,
                border: "none",
                padding: "6px 13px",
                borderRadius: 8,
                fontSize: 15,
                cursor: "pointer"
              }}
              onClick={() => onSuspect(s.id)}
            >Interrogate</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SuspectPanel;
