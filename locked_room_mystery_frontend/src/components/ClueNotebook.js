import React from "react";

/**
 * PUBLIC_INTERFACE
 * ClueNotebook - Noir glassmorphic notebook: evidence cards and noir-button links to suspects (initials only).
 * Props:
 *   clues: Array - All clue objects
 *   suspects: Array - All suspects
 *   onSuspectClick: fn(suspectId)
 */
function ClueNotebook({ clues, suspects, onSuspectClick }) {
  return (
    <div
      className="noir-dossier-card"
      style={{
        padding: "19px 12px 14px 19px",
        minHeight: 330,
        background: "var(--glass-surface)",
        borderRadius: "var(--radius)",
        backdropFilter: "var(--glass-blur)",
        border: "var(--border-med)",
        boxShadow: "0 1px 8px #1e28481a"
      }}
    >
      <h2 className="noir-title" style={{ marginBottom: 7 }}>Evidence Board</h2>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {clues.filter(clue => clue.found).map(clue => (
          <li
            key={clue.id}
            style={{
              margin: "15px 0",
              background: "rgba(85,117,255,0.08)",
              borderLeft: "5px solid var(--accent)",
              padding: "13px 12px 7px 22px",
              borderRadius: 9,
              boxShadow: "0 1px 5px #314ceb31"
            }}
          >
            <span style={{ fontWeight: 700, color: "var(--accent)", fontSize: 16 }}>{clue.name}</span>
            <span style={{ color: "var(--danger)", marginLeft: 10, fontStyle: "italic", fontWeight: 600 }}>
              {clue.redHerring ? " (Red Herring)" : ""}
            </span>
            <div style={{ fontSize: 15, color: "var(--text-light)", margin: "7px 0 4px 0" }}>
              {clue.description}
            </div>
            <div style={{ marginTop: 7 }}>
              <b>Linked suspects:&nbsp;</b>
              {suspects.filter(s => s.clueLinks.includes(clue.id)).length === 0 ?
                <span style={{ color: "#888" }}>Unknown</span>
                :
                suspects.filter(s => s.clueLinks.includes(clue.id)).map(s => (
                  <button
                    key={s.id}
                    onClick={() => onSuspectClick(s.id)}
                    className="noir-btn"
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "var(--radius-small)",
                      margin: "0 4px",
                      fontWeight: 700,
                      fontSize: 15,
                      padding: "4px 13px",
                      cursor: "pointer"
                    }}
                  >
                    <span className="noir-avatar-initials" style={{
                      height: 29,
                      width: 29,
                      fontSize: "1rem",
                      background: "#232e46",
                      color: "var(--accent)",
                      marginRight: 5,
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                      borderRadius: 8,
                      border: "1.2px solid #536",
                      fontWeight: 700,
                      userSelect: "none",
                      verticalAlign: "middle"
                    }}>{s.avatar || getInitials(s.name)}</span>
                    {s.name}
                  </button>
                ))
              }
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 28, color: "var(--danger)", fontWeight: 700, fontSize: 14, opacity: 0.87 }}>
        * Some clues are red herrings.
      </div>
    </div>
  );
}

// Helper for avatar initials
function getInitials(name) {
  return (name || "")
    .split(' ')
    .map(n => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

export default ClueNotebook;
