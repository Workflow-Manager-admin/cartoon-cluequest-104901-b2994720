import React from "react";

/**
 * PUBLIC_INTERFACE
 * ClueNotebook shows all clues discovered and lets players connect them with suspects.
 * Props:
 *   clues: Array - All clue objects
 *   suspects: Array - All suspects
 *   onSuspectClick: fn(suspectId)
 */
function ClueNotebook({ clues, suspects, onSuspectClick }) {
  return (
    <div style={{
      padding: "20px 16px",
      minHeight: 380,
      background: "#fff",
      borderRadius: 16
    }}>
      <h2 style={{ color: "#4E6E9A", marginBottom: 8, fontWeight: 700 }}>
        🔎 Clue Notebook
      </h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {clues.filter(clue => clue.found).map(clue => (
          <li key={clue.id} style={{
            margin: "15px 0",
            background: "#F5B04133",
            borderLeft: "5px solid #F5B041",
            padding: "12px 10px 6px 18px",
            borderRadius: 10,
            boxShadow: "0 1px 5px #e69b1720"
          }}>
            <span style={{ fontWeight: 600 }}>{clue.name}</span>
            <span style={{ color: "#943", marginLeft: 13, fontStyle: "italic" }}>
              {clue.redHerring ? " (Red Herring)" : ""}
            </span>
            <div style={{ fontSize: 15, color: "#444", margin: "7px 0" }}>
              {clue.description}
            </div>
            <div style={{ marginTop: 8 }}>
              <b>Possibly linked to:&nbsp;</b>
              {suspects.filter(s => s.clueLinks.includes(clue.id)).length === 0 ?
                <span style={{ color: "#888" }}>Unknown</span>
                :
                suspects.filter(s => s.clueLinks.includes(clue.id)).map(s => (
                  <button
                    key={s.id}
                    onClick={() => onSuspectClick(s.id)}
                    style={{
                      background: "#4E6E9A",
                      color: "#fff",
                      border: "none",
                      borderRadius: 8,
                      margin: "0 4px",
                      fontWeight: 600,
                      padding: "4px 14px",
                      cursor: "pointer"
                    }}
                  >
                    {s.emoji} {s.name}
                  </button>
                ))
              }
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 30, color: "#E74C3C", fontWeight: 600 }}>
        * Remember: Some clues may be red herrings!
      </div>
    </div>
  );
}

export default ClueNotebook;
