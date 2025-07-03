import React from "react";

/**
 * PUBLIC_INTERFACE
 * SuspectPanel - Noir style: Panel showing all suspects as dossier cards w/ initials avatar.
 * Props:
 *   suspects: Array - suspect objects
 *   onSuspect: fn(suspectId)
 */
function SuspectPanel({ suspects, onSuspect }) {
  return (
    <div style={{ padding: "23px 22px" }}>
      <h2 className="noir-title" style={{ marginBottom: 7 }}>
        Suspect Dossiers
      </h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {suspects.map(s => (
          <li
            key={s.id}
            className="noir-dossier-card"
            style={{
              marginBottom: 15,
              display: "flex",
              alignItems: "center",
              gap: 13,
              background: "rgba(28,32,39,0.97)",
              borderRadius: "var(--radius)",
              border: "var(--border-med)",
              boxShadow: "0 2px 11px #15193018"
            }}
          >
            <span
              aria-hidden="true"
              className="noir-avatar-initials"
              style={{
                height: 47, width: 47,
                fontSize: 20,
                border: "2px solid var(--accent)",
                background: "#232e46",
                color: "var(--accent)",
                marginRight: 3,
                userSelect: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, letterSpacing: "1.3px"
              }}
            >
              {s.avatar || getInitials(s.name)}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: "var(--accent)" }}>{s.name}</div>
              <div style={{
                color: s.emotion === "nervous" ? "var(--danger)" :
                  (s.emotion === "calm" ? "var(--accent)" : "#cda518"),
                fontWeight: 500,
                fontSize: 15
              }}>
                {`(${s.emotion})`}
              </div>
              <div style={{ color: "var(--text-light)", fontSize: 14, marginTop: 5 }}>
                {s.description}
              </div>
            </div>
            <button
              className="noir-btn"
              style={{
                background: "var(--accent)",
                color: "#fff",
                fontWeight: 700,
                border: "none",
                padding: "7px 18px",
                borderRadius: "var(--radius-small)",
                fontSize: 15,
                cursor: "pointer",
                marginLeft: 3,
                boxShadow: "0 1px 7px #7b91fe1d"
              }}
              onClick={() => onSuspect(s.id)}
            >
              Interrogate
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Helper: Generate initials from name if avatar missing
function getInitials(name) {
  return (name || "")
    .split(' ')
    .map(n => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

export default SuspectPanel;
